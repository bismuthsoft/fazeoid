<script lang="ts">
 import type { WaveType } from '$lib/audio/instrument';
 export let wave: WaveType;
 export let selected: boolean;
</script>

<svg
    width="200mm"
    height="200mm"
    viewBox="-30 -30 260 260"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
>
    <path class="{wave}" class:selected d="m 0,100 V 0 H 100 V 200 H 200 V 10"/>
</svg>

<style>
 svg {
     width: 100%;
     height: 100%;
 }
 path {
     fill: none;
     stroke: white;
     stroke-width: 0.1em;
     stroke-linejoin: round;
     stroke-linecap: round;
     vector-effect: non-scaling-stroke;
 }
 path.selected {
     stroke-width: 0.2em;
     stroke: #4df;
 }

 .sine {
     d: path('m 0,100 c 32.519021,-127.462103 65.778008,-139.099413 100,0 34.0844,138.26077 67.36379,128.32948 100,0');
 }
 .halfSine {
     d: path('M 0,200 C 32.519021,-54.913815 65.778008,-78.187487 100,200 H 200');
 }
 .absSine {
     d: path('m 0,200 c 32.519021,-254.913815 65.778008,-278.187487 100,0 33.57428,-269.956486 66.90171,-263.338278 100,0');
 }
 .triangle {
     d: path('M 0,100 50,0 150,200 200,100');
 }
 .square {
     d: path('M 0,100 V 0 H 100 V 200 H 200 V 10');
 }
 .saw {
     d: path('M 0,200 100,0 V 200 L 200,10');
 }
</style>
