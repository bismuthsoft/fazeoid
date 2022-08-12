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
 export let bgColor = '#fff';
 export let fgColor = '#7f9fff';
 export let label: string | undefined = undefined;
 export let showTicks: boolean = true;

</script>

<div class="container" style:width="{size}">
    <!-- <svg style:width="{size}"
         style:height="{size}"
         viewBox="{-20-strokeWidth/2} {-20-strokeWidth/2} {40+strokeWidth} {40+strokeWidth}">
         <circle class="knobBg" cx="0" cy="0" r="20"
         style:stroke="{bgColor}"
         style:stroke-width="{strokeWidth}"
         use:knobdrag="{knobParams}"
         />
         <circle class="knobFg" cx="0" cy="0" r="20" transform="rotate({90} 0 0)"
         style:stroke="{fgColor}"
         style:stroke-width="{strokeWidth*0.8}"
         style:stroke-dashoffset="{40*Math.PI - 40 * Math.PI * (value - min) / (max - min)}"
         style:stroke-dasharray="{40 * Math.PI}"
         />
         </svg> -->
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
        style="opacity:0.511046;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.270645;stroke-linecap:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.962681"
        d="M 8.5,8.6 A 5,5 0 1 0 1.5,8.6"
        use:knobdrag="{knobParams}"
    />
    <path
        transform="rotate({(value - min) / (max - min) * 270 + 135}, 5, 5)"
        style="opacity:1;fill:#ffe680;fill-opacity:0.957803;stroke:none;stroke-width:0.291007;stroke-linecap:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.522356"
        d="M 9.5640408,5.0000863 8.8569772,5.7071499 c -0.3904906,0.3904906 -1.0236127,0.3904669 -1.4141272,2e-7 -0.3904668,-0.3905145 -0.3904667,-1.0236129 1e-7,-1.4141273 0.3905144,-0.3904667 1.0236366,-0.3904906 1.4141272,0 z" />
    <g
        class="ticks"
        style="stroke:#000000;stroke-opacity:0.522356"
        transform="translate(-10,-10)"
        display="{showTicks ? 'initial' : 'none'}"
    >
        <path
            style="fill:none;stroke:#000000;stroke-width:0.278594;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.522356"
            d="M 17.470917,17.477763 18,18"
            id="path78235" />
        <path
            style="fill:none;stroke:#000000;stroke-width:0.278594;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.522356"
            d="M 18.499245,15.004841 19.242641,15"
            id="use78571" />
        <path
            style="fill:none;stroke:#000000;stroke-width:0.278594;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.522356"
            d="M 17.477763,12.529083 18,12"
            id="use78573" />
        <path
            style="fill:none;stroke:#000000;stroke-width:0.278594;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.522356"
            d="M 15.004841,11.500755 15,10.757359"
            id="use78575" />
        <path
            style="fill:none;stroke:#000000;stroke-width:0.278594;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.522356"
            d="M 12.529083,12.522237 12,12"
            id="use78577" />
        <path
            style="fill:none;stroke:#000000;stroke-width:0.278594;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.522356"
            d="M 11.500755,14.995159 10.757359,15"
            id="use78579" />
        <path
            style="fill:none;stroke:#000000;stroke-width:0.278594;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.522356"
            d="M 12.522237,17.470917 12,18"
            id="use78581" />
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
 svg {
     grid-area: 1/1;
 }
</style>
