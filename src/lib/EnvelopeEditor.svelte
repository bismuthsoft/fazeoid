<script lang="ts">
 import Knob from '@bismuthsoft/svelte-dj-knob/MinimalKnob.svelte';
 import { adsrEnvelope } from '$lib/soundgen/envelope';
 import type { EnvelopeParams } from '$lib/soundgen/envelope';
 import { writable } from 'svelte/store';

 export let envelope: EnvelopeParams;

 type KnobParams = {
     name: string,
     value: number,
     min: number,
     max: number,
 }

 let params = writable([
    {name: "attack", value: 8, min: 1, max: 20},
    {name: "decay", value: 8, min: 1, max: 20},
    {name: "sustain", value: 0.5, min: 0, max: 1},
    {name: "release", value: 8, min: 1, max: 20},
 ]);

 params.subscribe((value: KnobParams[]) => {
     const args = value.map((v: KnobParams) => v.value) as Parameters<typeof adsrEnvelope>;
     envelope = adsrEnvelope(...args);
 });
</script>

<div class="adsrGrid">
    {#each $params as {value, min, max}, index}
        <div class="knobContainer"
             style:grid-area="{1 + index % 2} / {1 + Math.floor(index/2)}"
        >
        <Knob bind:value="{value}" min="{min}" max="{max}"
              bgColor="#333" fgColor="#D88" size="2.5rem"/>
        </div>
    {/each}
</div>

<style>
 .adsrGrid {
     display: grid;
}

 .knobContainer {

 }
</style>
