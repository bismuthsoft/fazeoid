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
     d: path('M 0.18971793,0.50291098 C 33.803003,279.32945 67.018857,253.3512 99.938896,0.50291098 c 33.613284,278.82653902 66.829144,252.84828902 99.749174,0');
 }
 .quarterSine {
     d: path('M 0,199.52451 C 33.475668,60.636949 66.753435,-2.3367551 99.858602,0.89828129 L 99.858601,199.52451 200,199.51148');
 }
 .pulseSine {
     d: path('m 0,99.867476 c 16.785028,-138.921986 33.371595,-125.978626 49.810449,0 16.78502,138.921974 33.37159,125.978604 49.81044,0 H 200');
 }
 .square {
     d: path('M 0,100 V 0 H 100 V 200 H 200 V 100');
 }
</style>
