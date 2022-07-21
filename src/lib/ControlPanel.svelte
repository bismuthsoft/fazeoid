<script lang="js">
 import Knob from "@bismuthsoft/svelte-dj-knob/Knob.svelte";
 import Piano from "$lib/piano/Piano.svelte"
 import {SoundGenController, defaultParameters, randomizedParameters} from "$lib/SoundGenController.ts"

 import { onMount, onDestroy } from 'svelte'

 let controller;
 let sp = defaultParameters(1);
 onMount(() => {
     controller = new SoundGenController();
     sp = controller.synthParams;
     onDestroy(() => controller.stop());
 });
 function randomize () {
     controller.synthParams = randomizedParameters(sp);
     sp = controller.synthParams;
 }
</script>

<Piano bind:basePitch="{sp.basePitch}"/>
<Knob bind:value="{sp.volume}" label="Volume" min="{-72}" max="{0}"/>
<Knob bind:value="{sp.basePitch}" label="Base Pitch" min="{20}" max="{8000}"/>
<section>
    <heading>
        Modulations:
    </heading>
    {#each sp.oscs as osc, oscIndex}
        {#each osc.modulation as depth, modIndex}
            <Knob bind:value="{sp.oscs[oscIndex].modulation[modIndex]}"
                  label="{`${modIndex} to ${oscIndex}`}"
                  min="{0}" max="{1000}"/>
        {/each}
    {/each}
</section>
<section>
    <heading>
        Pitch ratios:
    </heading>
    {#each sp.oscs as osc, oscIndex}
        <Knob bind:value="{sp.oscs[oscIndex].pitchRatio}"
              label="{"osc" + oscIndex}"
              min="{0.01}" max="{10}"/>
    {/each}
</section>

<button on:click="{randomize}">Randomize</button>

<style>
 section heading {
     display: block;
 }
</style>
