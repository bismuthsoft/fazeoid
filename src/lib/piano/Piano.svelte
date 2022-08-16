<script lang="ts">
 import type {Note} from '$lib/audio/instrument'
 import keyBinds from './keyBinds'
 import noteNames from './noteNames'
 import { createEventDispatcher } from 'svelte';

 export let drumTrigger: 'none' | 'touch' | 'all' = 'touch';

 let keyLabel: 'none' | 'note' | 'noteOctave' = 'none';
 const numKeys = 36;
 let octave = 5;
 $: noteOffset = octave * 12;
 const numColumns = Math.ceil(numKeys * 7 / 12);

 $: keys = generateKeys(numKeys);

 type PianoNote = { keyboard?: Note, pointer?: Note };
 let notesDown: PianoNote[] = Array(numKeys).fill(0).map(() => ({}));
 let noteuid = 0;

 const dispatch = createEventDispatcher();
 function pressNote(note: number, drumMode: boolean) : Note {
     const pressed: Note = {
         note: note + noteOffset,
         uid: noteuid++,
         instrumentIndex: 0,
         drumMode: drumTrigger === 'all' || drumMode,
     }
     dispatch('noteDown', pressed);
     return pressed;
 }

 function releaseNote(note: Note) {
     if (!note.drumMode) {
         dispatch('noteUp', note.uid);
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
         document.activeElement instanceof HTMLInputElement)
     {
         return;
     }
     const index = keyBinds[ev.code];
     if (index !== undefined) {
         const note = index;
         ev.preventDefault();
         if (ev.repeat) return;
         const keyboardNote = notesDown[note]?.keyboard;
         if (down && !keyboardNote) {
             const noteDown = pressNote(note, false);
             notesDown[note].keyboard = noteDown;
             if (noteDown.drumMode) {
                 setTimeout(() => {
                     notesDown[note].keyboard = undefined;
                 }, 200);
             }
         } else if (!down) {
             if (keyboardNote) {
                 releaseNote(keyboardNote);
                 notesDown[note].keyboard = undefined;
             } else if (drumTrigger !== 'all') {
                 console.log('Bad keyboard note up ' + note);
             }
         }
     }
 }

 function pointerDown (note: number, touch: boolean) {
     if (!notesDown[note]?.pointer) {
         const noteDown = pressNote(note, touch && drumTrigger === 'touch');
         notesDown[note].pointer = noteDown;
         if (noteDown.drumMode) {
             setTimeout(() => {
                 notesDown[note].pointer = undefined;
             }, 200);
         }
     }
 }

 function pointerUp(note: number) {
     const pointerNote = notesDown[note]?.pointer;
     if (pointerNote) {
         releaseNote(pointerNote);
         notesDown[note].pointer = undefined;
     }
 }
</script>

<svelte:window
    on:keydown="{keyboardDown}"
    on:keyup="{keyboardUp}"
/>

<div class="piano"
     style:grid-template-columns="repeat({numColumns}, 1fr)"
     style:width="100%"
>
    {#each keys as {isWhite, row, column, note}}
        <div
            style:grid-area="{row} / {column}"
            class:whiteKey="{isWhite}"
            class:blackKey="{!isWhite}"
            class:odd="{note % 24 < 12}"
            class:down="{notesDown[note]?.keyboard || notesDown[note]?.pointer}"

            draggable=false
            on:mousedown="{() => pointerDown(note, false)}"
            on:touchstart="{() => pointerDown(note, true)}"
            on:pointerup="{() => pointerUp(note)}"
            on:mouseenter="{(ev) => {if (ev.buttons > 0) pointerDown(note, false);}}"
            on:mouseleave="{() => pointerUp(note)}"
        >
            <div class='keyLabel {isWhite ? 'keyLabelWhite' : 'keyLabelBlack'}'>
                {(keyLabel === 'noteOctave' ? noteNames[note % 12] : '') +
                (keyLabel !== 'none' ? Math.floor(note / 12) : '')}
            </div>
        </div>
    {/each}
</div>

<style>

 .piano {
     display: grid;
     height: 100%;
     grid-template-rows: 1fr 1fr;
     grid-auto-flow: none;
     touch-action: none;
 }
 .whiteKey {
     display: grid;
     place-items: center;
     user-select: none;
     border: 0.2em solid var(--bg-color);
     margin: 0 -1px;
     transform: translate(0%, -40%);
     height: 170%;
     border-radius: 1em;
     background: white;
 }
 .whiteKey.odd {
     background: #cfc
 }
 .whiteKey.down {
     background: #08d
 }
 .blackKey {
     display: grid;
     place-items: center;
     user-select: none;
     border: 0.2em solid var(--bg-color);
     margin: 0 -1px;
     transform: translate(50%, 0%);
     height: 110%;
     z-index: 1;
     border-radius: 2em;
     background: #444;
 }
 .blackKey.down {
     background: #08d
 }

 .keyLabel {
     position: absolute;
     justify-self: center;
     z-index: 2;
     user-select: none;
     font-weight: bold;
 }
 .keyLabelWhite {
     margin-top: 2em;
     align-self: middle;
     color: #666;
 }

 .keyLabelBlack {
     align-self: end;
     margin-bottom: 8px;
     color: white;
 }
</style>
