<script lang="js">
 import Slider from "$lib/Slider.svelte"
 import Knob from "$lib/Knob.svelte"
 import Piano from "$lib/piano/Piano.svelte"

 import { onMount, onDestroy } from 'svelte'
 let stop = false;

 let basePitch = 600;
 let volume = 0.5;

 function mkDefaultParams(numOscs) {
     return {
         numOscs: numOscs,
         oscs: Array(numOscs).fill().map((_, i) => ({
             modulation: Array(i).fill().map(() => 1),
             pitchRatio: 1,
         })),
     };
 }

 let synthParams = mkDefaultParams(3);

 function writeSynthParams(p) {
     let params = {
         ...synthParams,
         volume: volume,
         oscs: synthParams.oscs.map((v) => ({
             modulation: v.modulation,
             pitch: basePitch * v.pitchRatio,
         }))
     };
     p.postMessage(['params', params]);
 }

 function randomize() {
     basePitch = Math.random()*440 + 220;
     synthParams.oscs.forEach((osc, i) => {
         osc.modulation = Array(i).fill().map(() =>
             Math.pow(10, Math.random()*6-3));
         osc.pitchRatio = Math.pow(Math.random(), 2) * 10;
     });
     synthParams = synthParams;
 }

 onMount(async () => {
     const ac = new AudioContext();
     await ac.audioWorklet.addModule('soundgen.bundle.js');
     const waveNode = new AudioWorkletNode(ac, 'wave-generator');
     waveNode.connect(ac.destination);
     const p = waveNode.port;
     p.postMessage(['srate', ac.sampleRate]);

     let iv = window.setInterval(() => {
         writeSynthParams(p);
         if (stop) {
             p.postMessage('stop');
             window.clearInterval(iv);
         }
     }, 16);
 });

 onDestroy(() => {
     stop = true;
 });
</script>

<Piano bind:basePitch="{basePitch}"/>
<Slider bind:value="{volume}" label="Volume" min="{0}" max="{1}" log=false/>
<Slider bind:value="{basePitch}" label="Base Pitch" min="{20}" max="{8000}" log=true/>
{#each synthParams.oscs as osc, oscIndex}
    {#each osc.modulation as depth, modIndex}
        <Slider bind:value="{synthParams.oscs[oscIndex].modulation[modIndex]}"
                label="{`Modulation from ${modIndex} to ${oscIndex}`}"
                min="{0}" max="{1000}" log=true/>
    {/each}
{/each}
{#each synthParams.oscs as osc, oscIndex}
    <Slider bind:value="{synthParams.oscs[oscIndex].pitchRatio}"
            label="{"PitchRatio of osc" + oscIndex}"
            min="{0.01}" max="{10}" log=true/>
{/each}

<button on:click="{randomize}">Randomize</button>
