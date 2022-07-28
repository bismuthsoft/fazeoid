<script lang="ts">
 import type {Note} from '$lib/Instrument'
 import keyBinds from './keyBinds'
 import noteNames from './noteNames'
 import { onMount, createEventDispatcher } from 'svelte';

 const colors: Record<string, string> = {
     middleC: 'rgb(255, 0.0, 0.0)',
     whiteUpEven: 'white',
     whiteUpOdd: '#ddd',
     whiteDown: 'blue',
     blackUp: 'black',
     blackDown: 'cyan',
 };

 let keyWidth = 20;
 const maxKeyWidth = 28;
 const minKeyWidth = 12;
 const numKeys = 128;
 const numColumns = Math.ceil(numKeys * 7 / 12);
 const middleC = 60;

 let elemWidth: number;
 let container: HTMLElement;
 onMount(() => {
     container.scrollTo((numKeys * keyWidth) / 2 - elemWidth / 2, 0);
 })

 $: keys = generateKeys(numKeys);

 let pressedNotes: Note[] = [];
 let notesDown: boolean[] = [];

 let noteuid = 0;
 const dispatch = createEventDispatcher();
 function pressKey(note: number) {
     const pressed: Note = {
         note,
         uid: noteuid++,
         instrumentIndex: 0,
     }
     dispatch('noteDown', pressed);
     pressedNotes.push(pressed);
     notesDown[note] = true;
 }

 function releaseKey(note: number) {
     const index = pressedNotes.findIndex(({note: n}) => note === n);
     if (index > -1) {
         dispatch('noteUp', pressedNotes[index].uid);
         pressedNotes.splice(index, 1)
         notesDown[note] = false;
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

 function handleKey(ev: KeyboardEvent, down: boolean) {
     if (ev.altKey || ev.ctrlKey || ev.shiftKey) {
         return;
     }
     const index = keyBinds[ev.code];
     if (index !== undefined) {
         ev.preventDefault();
         if (!ev.repeat) {
             if (down) {
                 pressKey(index+60);
             } else {
                 releaseKey(index+60);
             }
         }
     }
 }

 function scaleUp () {
     keyWidth = Math.min(keyWidth + 2, maxKeyWidth);
     container.scrollBy(numKeys, 0);
 }

 function scaleDown () {
     keyWidth = Math.max(keyWidth - 2, minKeyWidth);
     container.scrollBy(-numKeys, 0);
 }

 function keyColor (notesDown: boolean[], index: number) {
     const isWhite = isWhiteNote(index);
     const isDown = notesDown[index];

     return colors[
         (isWhite ? (
             isDown ? 'whiteDown' : (
                 (index === middleC) ? 'middleC' :
                 ((index % 24 < 12) ? 'whiteUpOdd' : 'whiteUpEven'))
         ) : (isDown ? 'blackDown' : 'blackUp'))];
 }
</script>

<svelte:window
    on:keydown="{(ev) => handleKey(ev, true)}"
    on:keyup="{(ev) => handleKey(ev, false)}"
/>

<div id="controlPanel">
    <button on:click={scaleUp}>+</button>
    <button on:click={scaleDown}>-</button>
        {keyWidth}
</div>

<div class="pianoContainer" bind:this="{container}" bind:clientWidth="{elemWidth}">
    <div class="piano"
         style:grid-template-columns="repeat({numColumns}, 1fr)"
         style:width="{numKeys * keyWidth}px"
    >
        {#each keys as {isWhite, row, column, note}}
            <div
                style:grid-area="{row} / {column}"
                style:background="{keyColor(notesDown, note)}"
                class="{isWhite ? 'whiteKey' : 'blackKey'}"

                draggable=false
                on:mousedown="{() => pressKey(note)}"
                on:mouseup="{() => releaseKey(note)}"
                on:mouseenter="{(ev) => {if (ev.buttons > 0) pressKey(note);}}"
                on:mouseleave="{() => releaseKey(note)}"
            >
                <div class='keyLabel {isWhite ? 'keyLabelWhite' : 'keyLabelBlack'}'>
                    {(keyWidth >= 20 ? noteNames[note % 12] : '') +
                    (keyWidth >= 24 ? Math.floor(note / 12) : '')}
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
 .whiteKey {
     display: grid;
     place-items: center;
     user-select: none;
     margin: 0px -0.5px;
     border: 2px solid black;
     transform: translate(0%, -50%);
     height: 200%;
     border-radius: 5px;
 }
 .blackKey {
     display: grid;
     place-items: center;
     user-select: none;
     border: 2px solid white;
     transform: translate(50%, 0%);
     z-index: 1;
     border-radius: 10px;
 }

 .keyLabel {
     position: absolute;
     justify-self: center;
     z-index: 2;
     user-select: none;
 }
 .keyLabelWhite {
     margin-top: 2em;
     align-self: middle;
     color: black;
 }
 .keyLabelBlack {
     align-self: end;
     margin-bottom: 8px;
     color: white;
 }

 .piano {
     grid-template-rows: 60px 50px;
     grid-auto-flow: row;
     display: grid;
 }

 .pianoContainer {
     overflow: scroll hidden;
     width: 100%;
 }
</style>
