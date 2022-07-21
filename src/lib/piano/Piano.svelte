<script lang="ts">
 export let basePitch: number;
 let elemWidth: number = 800;
 $: numKeys = Math.floor(elemWidth / 15);
 $: firstOctave = 5 - Math.floor(numKeys / 12.0 / 2.0);
 $: firstNote = firstOctave * 12;

 function hitKey(index: number) {
     basePitch = 440 * Math.pow(2, (index-60)/12)
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

 function handleKey(ev: KeyboardEvent) {
     if (ev.altKey || ev.ctrlKey || ev.shiftKey) {
         return;
     }
     const mapping = 'ZSXDCVGBHNJMQ2W3ER5T6Y7UI9O0P';
     const valid = ev.code.startsWith('Digit') || ev.code.startsWith('Key');
     const k = ev.code.charAt(ev.code.length - 1);
     const index = mapping.indexOf(k);
     if (valid && index >= 0) {
         ev.preventDefault();
         hitKey(48 + index);
     }
 }
</script>

<svelte:window on:keydown="{handleKey}"/>

<div id="piano" bind:clientWidth="{elemWidth}">
    {#each generateKeys(numKeys) as {isWhite, row, column}, index}
        <button
            style="grid-column: {column} / {column}; grid-row: {row} / {row}"
            on:mousedown="{() => hitKey(firstNote + index)}"
            class="{isWhite ? 'whiteKey' : 'blackKey'}"
        >
        </button>
    {/each}
</div>

<style>
 .whiteKey {
     transform: translate(0%, -50%);
     height: 200%;
     background: white;
     border-radius: 5px;
 }
 .blackKey {
     transform: translate(50%, 0%);
     z-index: 1;
     background: black;
     border-radius: 10px;
 }
 #piano {
     grid-template-rows: 60px 50px;
     grid-auto-flow: row;
     display: grid;
 }
</style>
