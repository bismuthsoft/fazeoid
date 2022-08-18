<script lang="ts">
 import type {Note} from '$lib/audio/instrument'
 import keyBinds from './keyBinds'
 import noteNames from './noteNames'
 import { createEventDispatcher } from 'svelte';

 let keyLabel: 'none' | 'note' | 'noteOctave' = 'none';
 export let portrait: boolean;

 $: numKeys = portrait ? 24 : 36;
 let octave = 5;
 $: noteOffset = octave * 12;
 const numColumns = Math.ceil(numKeys * 7 / 12);

 $: keys = generateKeys(numKeys);

 type PianoNote = { keyboard?: Note, pointer?: Note };
 let notesDown: PianoNote[] = [];
 let noteuid = 0;

 const dispatch = createEventDispatcher();
 function pressNote(note: number) : Note {
     const pressed: Note = {
         note: note + noteOffset,
         uid: noteuid++,
         instrumentIndex: 0,
     }
     dispatch('noteDown', pressed);
     return pressed;
 }

 function releaseNote(note: Note) {
     dispatch('noteUp', note.uid);
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
             notesDown[note] = {
                 ...(notesDown[note] ?? {}),
                 keyboard: pressNote(note),
             };
         } else if (!down) {
             if (keyboardNote) {
                 releaseNote(keyboardNote);
                 notesDown[note].keyboard = undefined;
             } else {
                 console.log('Bad keyboard note up ' + note);
             }
         }
     }
 }

 function pointerDown (note: number) {
     if (!notesDown[note]?.pointer) {
         notesDown[note] = {
             ...(notesDown[note] ?? {}),
             pointer: pressNote(note),
         };
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
            class:odd="{column % 2 === 0}"
            class:down="{notesDown[note]?.keyboard || notesDown[note]?.pointer}"

            draggable=false
            on:pointerdown="{() => pointerDown(note)}"
            on:pointerup="{() => pointerUp(note)}"
            on:mouseenter="{(ev) => {if (ev.buttons > 0) pointerDown(note);}}"
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
     height: 12rem;
     padding: .5rem;
     box-sizing: border-box;
     grid-template-rows: 1fr 1fr;
     grid-auto-flow: none;
     touch-action: none;
     opacity: 0.5;
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
 }
 .whiteKey.odd {
     background: #dddddd;
 }
 .whiteKey.down {
     background: linear-gradient(#fff, #08f);
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
     background: linear-gradient(#000, #4bf);
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
