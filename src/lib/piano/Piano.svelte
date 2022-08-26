<script lang="ts">
 import type {Note} from '$lib/audio/instrument'
 import keyBinds from './keyBinds'
 import noteNames from './noteNames'
 import { createEventDispatcher } from 'svelte';

 export let keyLabel: 'none' | 'note' | 'noteOctave' = 'noteOctave';
 export let portrait: boolean;

 $: numKeys = portrait ? 18 : 36;
 let octave = 5;
 const MIN_OCTAVE = 1;
 const MAX_OCTAVE = 8;
 let noteOffset: number;
 $: {
     noteOffset = (octave - Math.floor(numKeys/24)) * 12;
     clearNotes();
 }
 const numColumns = Math.ceil(numKeys * 7 / 12);

 $: keys = generateKeys(numKeys);

 type PianoNote = { keyboard?: Note, pointer?: Note };
 let notesDown: PianoNote[] = [];
 let noteuid = 0;

 const dispatch = createEventDispatcher();
 function pressNote(note: number, type: keyof PianoNote): Note | undefined {
     if (notesDown[note] && notesDown[note][type]) {
         return undefined;
     }
     const pressed: Note = {
         note: note + noteOffset,
         uid: noteuid++,
         instrumentIndex: 0,
     }
     notesDown[note] = {
         ...(notesDown[note] ?? {}),
         [type]: pressed,
     };
     dispatch('noteDown', pressed);
     return pressed;
 }

 function clearNotes() {
     notesDown.forEach((note) => {
         if (note.keyboard) dispatch('noteUp', note.keyboard.uid);
         if (note.pointer) dispatch('noteUp', note.pointer.uid);
     });
     notesDown = [];
 }

 function releaseNote(note: number, type: keyof PianoNote) {
     const noteObj = notesDown[note] && notesDown[note][type];
     if (noteObj) {
         dispatch('noteUp', noteObj.uid);
         notesDown[noteObj.note - noteOffset][type] = undefined;
     } else {
         console.log('Bad ' + type + ' note up ' + note);
     }
 }

 function isWhiteNote(index: number) : boolean {
     return [1,0,1,0,1,1,0,1,0,1,0,1][index % 12] === 1;
 }

 function collapseColumn(index: number) : number {
     const octave = Math.floor(index / 12) * 7;
     return [1,1,2,2,3,4,4,5,5,6,6,7][index % 12] + octave;
 }

 function generateKeys (numKeys: number) {
     return Array(numKeys).fill(0).map((_, index: number) => {
         const note = index;
         const isWhite = isWhiteNote(note);
         const row = isWhite ? 2 : 1;
         const column = collapseColumn(note);
         return {isWhite, row, column, note};
     })
 }

 function keyboardDown (ev: KeyboardEvent) { return handleKeyboard(ev, true); }
 function keyboardUp (ev: KeyboardEvent) { return handleKeyboard(ev, false); }

 function handleKeyboard(ev: KeyboardEvent, down: boolean) {
     if ((down && (ev.altKey || ev.ctrlKey || ev.shiftKey)) ||
         document.activeElement instanceof HTMLInputElement) {
         return undefined;
     }
     const note = keyBinds[ev.code];
     if (note !== undefined) {
         ev.preventDefault();
         if (ev.repeat) return;
         if (down) {
             pressNote(note, 'keyboard');
         } else {
             releaseNote(note, 'keyboard');
         }
     }
 }
</script>

<svelte:window
    on:keydown="{keyboardDown}"
    on:keyup="{keyboardUp}"
/>

<div class="pianoBar">
    <button class="octaveButton"
            on:click="{() => octave = Math.max(MIN_OCTAVE, octave - 1)}"> -
    </button>
    Octave: {octave}
    <button class="octaveButton"
            on:click="{() => octave = Math.min(MAX_OCTAVE, octave + 1)}"> +
    </button>
</div>

<div class="piano"
     style:grid-template-columns="repeat({numColumns}, 1fr)"
     style:width="100%"
>
    {#each keys as {isWhite, row, column, note} (note)}
        <div
            style:grid-area="{row} / {column}"
            class:whiteKey="{isWhite}"
            class:blackKey="{!isWhite}"
            class:down="{notesDown[note]?.keyboard || notesDown[note]?.pointer}"
            on:pointerdown="{() => pressNote(note, 'pointer')}"
            on:pointerup="{() => releaseNote(note, 'pointer')}"
            on:mouseenter="{(ev) => {if (ev.buttons > 0) pressNote(note, 'pointer');}}"
            on:mouseleave="{() => releaseNote(note, 'pointer')}"
        >
            <div class='keyLabel'>
                {(keyLabel === 'noteOctave' ? noteNames[note % 12] : '') +
                (keyLabel !== 'none' ? octave + Math.floor(note / 12) : '')}
            </div>
        </div>
    {/each}
</div>

<style>
 .pianoBar {
     align-self: center;
 }
 .octaveButton {
     font-size: 1rem;
     width: 40px;
 }
 .piano {
     display: grid;
     height: 9rem;
     padding: .5rem;
     box-sizing: border-box;
     grid-template-rows: 1fr 1fr;
     grid-auto-flow: none;
     touch-action: none;
     opacity: 0.7;
     overflow-x: hidden;
     overflow-y: hidden;
 }
 .whiteKey {
     display: grid;
     place-items: center;
     user-select: none;
     transform: translate(0%, -40%);
     height: 170%;
     background: #ffffff;
     border-radius: 1em;
     border: solid #8888 .125em;
 }
 /* Octave coloring: */
 .whiteKey:nth-child(24n+13),
 .whiteKey:nth-child(24n+15),
 .whiteKey:nth-child(24n+17),
 .whiteKey:nth-child(24n+18),
 .whiteKey:nth-child(24n+20),
 .whiteKey:nth-child(24n+22),
 .whiteKey:nth-child(24n+24) {
     background: #dddddd;
 }
 .whiteKey.down {
     background: linear-gradient(#8cf, #08f);
 }
 .blackKey {
     display: grid;
     place-items: center;
     user-select: none;
     transform: translate(50%, 0%);
     height: 115%;
     z-index: 1;
     border-radius: 1em;
     background: #000;
 }
 .blackKey.down {
     background: linear-gradient(#4bf, #048);
 }

 .keyLabel {
     position: absolute;
     justify-self: center;
     z-index: 2;
     user-select: none;
     font-weight: bold;
 }
 .whiteKey .keyLabel {
     margin-top: 2em;
     align-self: middle;
     color: #333;
 }
 .blackKey .keyLabel {
     align-self: end;
     margin-bottom: 8px;
     color: white;
 }
</style>
