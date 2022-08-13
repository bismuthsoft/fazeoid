<script lang="ts">
 import knobdrag, {makeValueStore} from '@bismuthsoft/svelte-dj-knob/knobdrag';
 import Input from '@bismuthsoft/svelte-dj-knob/Input.svelte';

 // Parameters
 export let min = 0;
 export let max = 100;
 export let step = (min + max) / 100;
 export let value = (min + max) / 2;
 const valueStore = makeValueStore(value, newValue => value = newValue);
 $: valueStore.set(value);
 let inputElem: Element;
 $: knobParams = { min, max, step, valueStore, inputElem };

 // Aesthetic
 export let size = '5rem';
 export let strokeWidth = 8;
 export let bgColor = '#0000007f';
 export let pointerColor = '#ffffff';
 export let label: string | undefined = undefined;
 export let showTicks: boolean = true;

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
        width="{size}"
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
            transform="rotate({(value - min) / (max - min) * 270 + 135}, 5, 5)"
            d="M 9.5640408,5.0000863 8.8569772,5.7071499 c -0.3904906,0.3904906 -1.0236127,0.3904669 -1.4141272,2e-7 -0.3904668,-0.3905145 -0.3904667,-1.0236129 1e-7,-1.4141273 0.3905144,-0.3904667 1.0236366,-0.3904906 1.4141272,0 z" />
        <g
            class="ticks"
            transform="translate(-10,-10)"
            display="{showTicks ? 'initial' : 'none'}"
        >
            <path d="M 17.470917,17.477763 18,18" />
            <path d="M 18.499245,15.004841 19.242641,15" />
            <path d="M 17.477763,12.529083 18,12" />
            <path d="M 15.004841,11.500755 15,10.757359" />
            <path d="M 12.529083,12.522237 12,12" />
            <path d="M 11.500755,14.995159 10.757359,15" />
            <path d="M 12.522237,17.470917 12,18" />
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
     stroke: #0000007f;
     stroke-width: 0.2px;
     vector-effect: non-scaling-stroke;
 }
 svg {
     grid-area: 1/1;
 }
</style>
