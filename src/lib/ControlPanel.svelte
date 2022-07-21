<script lang="js">
 import Knob from "@bismuthsoft/svelte-dj-knob/Knob.svelte";
 import Piano from "$lib/piano/Piano.svelte"
 import {SoundGenController, defaultParams, randomizedParams} from "$lib/SoundGenController.ts"

 import { onMount, onDestroy } from 'svelte'

 let ctrl = new SoundGenController();
 onMount(() => {
     ctrl.setupWorklet();
     onDestroy(() => controller.stop());
 });
 function randomize () {
     ctrl.params = randomizedParams(ctrl.params);
 }
</script>

<Piano bind:basePitch="{ctrl.params.basePitch}"/>
<Knob bind:value="{ctrl.params.volume}" label="Volume" min="{-72}" max="{0}"/>
<Knob bind:value="{ctrl.params.basePitch}" label="Base Pitch" min="{20}" max="{8000}"/>
<section>
    <heading>
        Modulations:
    </heading>
    {#each ctrl.params.oscs as osc, oscIndex}
        {#each osc.modulation as depth, modIndex}
            <Knob bind:value="{ctrl.params.oscs[oscIndex].modulation[modIndex]}"
                  label="{`${modIndex} to ${oscIndex}`}"
                  min="{0}" max="{10}"
            />
        {/each}
    {/each}
</section>
<section>
    <heading>
        Pitch ratios:
    </heading>
    {#each ctrl.params.oscs as osc, oscIndex}
        <Knob bind:value="{ctrl.params.oscs[oscIndex].pitchRatio}"
              label="{"osc" + oscIndex}"
              min="{0.01}" max="{10}"
        />
    {/each}
</section>

<button on:click="{randomize}">Randomize</button>

<style>
 section heading {
     display: block;
 }
</style>
