<script lang="ts">
 import knobdrag, {makeValueStore} from '@bismuthsoft/svelte-dj-knob/knobdrag';
 import Input from '@bismuthsoft/svelte-dj-knob/Input.svelte';

 // Parameters
 export let min = 0;
 export let max = 100;
 export let step = (max - min) / 100;
 export let value = (min + max) / 2;
 const valueStore = makeValueStore(value, newValue => value = newValue);
 $: valueStore.set(value);
 let inputElem: Element;
 $: knobParams = { min, max, step, valueStore, inputElem };

 // Aesthetic
 export let size = '5rem';
 export let bgColor = '#0000007f';
 export let pointerColor = '#ffffff';
 export let label: string | undefined = undefined;
 export let numTicks: number = 6;

 // Visual math functions
 const visualRange = 270;
 const visualStartPoint = 135;
 const normalizeValue = (value: number) => (value - min) / (max - min);
 const angleOnKnob = (normValue: number) => normValue * visualRange + visualStartPoint;
 const valueOnKnob = (value: number) => angleOnKnob(normalizeValue(value));

 $: ticks = Array(numTicks).fill(0).map((_, i) => {
     return {
         angle: angleOnKnob(numTicks === 1 ? 0.5 : i / (numTicks-1)),
     }
 });

</script>

<div class="container" style:width="{size}">
    <div class="value" style:font-size="calc({size} / 5)">
        <Input
            bind:value
            bind:inputElem
            color="#eee"
        />
    </div>
    <svg
        viewBox="0 0 10 8.6"
        version="1.1"
        id="svg5"
        xmlns="http://www.w3.org/2000/svg">
        <path
            style:fill="{bgColor}"
            use:knobdrag="{knobParams}"
            d="M 8.5,8.6 A 5,5 0 1 0 1.5,8.6"
        />
        <path
            style:fill="{pointerColor}"
            transform="rotate({valueOnKnob(value)}, 5, 5)"
            d="M 9.5640408,5.0000863 8.8569772,5.7071499 c -0.3904906,0.3904906 -1.0236127,0.3904669 -1.4141272,2e-7 -0.3904668,-0.3905145 -0.3904667,-1.0236129 1e-7,-1.4141273 0.3905144,-0.3904667 1.0236366,-0.3904906 1.4141272,0 z" />
        <g class="ticks" >
            {#each ticks as {angle}}
                <path d="M 8.5,5 9,5" transform="rotate({angle}, 5, 5)"/>
            {/each}
        </g>
    </svg>
    {#if label}
        <div style:font-size="calc({size} / 5)">
            {label}
        </div>
    {/if}
</div>

<style>
 .container {
     display: inline-grid;
     grid-auto-flow: row;
     place-items: center;
 }
 .value {
     position: relative;
     top: 6.5%;
     grid-area: 1/1;
     width: 50%;
     pointer-events: none;
 }
 .value :global(input) {
     padding: 0;
     font-size: 100%;
 }
 .ticks {
     stroke: #ffffff7f;
     stroke-width: 0.2px;
     vector-effect: non-scaling-stroke;
 }
 svg {
     grid-area: 1/1;
 }
</style>
