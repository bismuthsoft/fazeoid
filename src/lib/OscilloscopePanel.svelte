<script lang="ts">
 import type {Instrument, Note} from '$lib/soundgen/instrument';
 import Voice from '$lib/soundgen/Voice';
 import Oscilloscope from './Oscilloscope.svelte';

 export let instrument: Instrument;
 export let zoom = 0.2; // How many periods to show
 let resolution = 400;
 $: sampleRate = zoom * resolution * 440;

 function rotateData<T>(data: T[][]) : T[][] {
     return Array(data[0].length).fill(0).map((_, i) => data.map((row) => row[i]));
 }

 function getOscillators (voice: Voice) : number[][] {
     const oscData = Array(resolution).fill(0).map(() => voice.getOscillators());
     console.log(oscData);
     return rotateData(oscData);
 }

 const note: Note = {note: 69, instrumentIndex: 0, uid: 0}
 $: voice = new Voice(instrument, note, sampleRate);
 $: oscData = getOscillators(voice);

 // Maybe useful: shifting
 // const shiftRate = 60; // FPS of shifting by 1 sample
 // setInterval(() => {
 //     voice.setInstrument(instrument);
 //     let nextSamples = voice.getOscillators();
 //     oscData = oscData.map((row, index) => {
 //         row.shift();
 //         row.push(nextSamples[index]);
 //         return row;
 //     })
 // }, 1000 / shiftRate);
</script>

<div class="panel"
     style:grid-template-rows="repeat(1fr, {instrument.oscs.length-1})"
>
    {#each oscData as data, index}
        <Oscilloscope waveData="{data}" gridrow="{index+1}"/>
    {/each}
</div>

<style>
 .panel {
     display: inline-grid;
     height: 100%;
 }
</style>
