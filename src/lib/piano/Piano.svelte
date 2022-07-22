<script lang="ts">
 let elemWidth: number = 800;
 $: numKeys = Math.floor(elemWidth / 15);
 $: firstOctave = 5 - Math.floor(numKeys / 12.0 / 2.0);
 $: firstNote = firstOctave * 12;


 import { createEventDispatcher } from 'svelte';

 let keyboardState: boolean[] = [];
 let keysDown = 0;

 const dispatch = createEventDispatcher();
 function pressKey(index: number) {
     keysDown++;
     keyboardState[index] = true;
     keyboardState = keyboardState;
     dispatch('noteEvent', {down: true, note: index});
 }
 function releaseKey(index: number) {
     if (keyboardState[index]) {
         keysDown--;
         keyboardState[index] = false;
         keyboardState = keyboardState;
         if (keysDown === 0) {
             dispatch('noteEvent', {down: false, note: index});
         }
     }
 }

 function generateKeys (numKeys: number) {
     function isWhiteNote(index: number) : boolean {
         return [1,0,1,0,1,1,0,1,0,1,0,1][index % 12] === 1;
     }
     function collapseColumn(index: number) : number {
         const octave = Math.floor(index / 12) * 7;
         return [1,1,2,2,3,4,4,5,5,6,6,7][index % 12] + octave;
     }
     return Array(numKeys).fill(0).map((_, index: number) => {
         const isWhite = isWhiteNote(index);
         const row = isWhite ? 0 : 1;
         const column = collapseColumn(index);
         return {isWhite, row, column};
     })
 }

 function getKeyCodeIndex(code: string) : number | undefined {
     const mapping = 'ZSXDCVGBHNJMQ2W3ER5T6Y7UI9O0P';
     const valid = code.startsWith('Digit') || code.startsWith('Key');
     const k = code.charAt(code.length - 1);
     const index = mapping.indexOf(k);
     if (valid && index >= 0) {
         return index;
     }
 }

 function handleKey(ev: KeyboardEvent, down: boolean) {
     if (ev.altKey || ev.ctrlKey || ev.shiftKey || ev.repeat) {
         return;
     }
     const index = getKeyCodeIndex(ev.code);
     if (index !== undefined) {
         ev.preventDefault();
         if (down) {
             pressKey(48 + index);
         } else {
             releaseKey(48 + index);
         }
     }
 }
</script>

<svelte:window
    on:keydown="{(ev) => handleKey(ev, true)}"
    on:keyup="{(ev) => handleKey(ev, false)}"
/>

<div id="piano" bind:clientWidth="{elemWidth}">
    {#each generateKeys(numKeys) as {isWhite, row, column}, index}
        <div
            draggable=false
            style="grid-column: {column} / {column}; grid-row: {row} / {row}"
            on:mousedown="{() => pressKey(index+firstNote)}"
            on:mouseup="{() => releaseKey(index+firstNote)}"
            on:mouseenter="{(ev) => {if (ev.buttons > 0) pressKey(index+firstNote);}}"
            on:mouseleave="{() => releaseKey(index+firstNote)}"
            class="{isWhite ? 'whiteKey' : 'blackKey'}
                   {isWhite ?
                   (keyboardState[index+firstNote] ? 'whiteKeyDown' : 'whiteKeyUp') :
                   (keyboardState[index+firstNote] ? 'blackKeyDown' : 'blackKeyUp')}"
        >
        </div>
    {/each}
</div>

<style>
 .whiteKey {
     user-select: none;
     margin: 0px -0.5px;
     border: 2px solid black;
     transform: translate(0%, -50%);
     height: 200%;
     border-radius: 5px;
 }
 .blackKey {
     user-select: none;
     border: 2px solid white;
     transform: translate(50%, 0%);
     z-index: 1;
     border-radius: 10px;
 }
 .whiteKeyUp {
     background: white;
 }
 .whiteKeyDown {
     background: blue;
 }
 .blackKeyUp {
     background: black;
 }
 .blackKeyDown {
     background: cyan;
 }
 #piano {
     grid-template-rows: 60px 50px;
     grid-auto-flow: row;
     display: grid;
 }
</style>
