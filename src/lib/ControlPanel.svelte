<script lang="ts">
 import Knob from "@bismuthsoft/svelte-dj-knob/Knob.svelte";
 import Piano from "$lib/piano/Piano.svelte"
 import {SoundGenController} from "$lib/SoundGenController.js"

 import { onMount, onDestroy } from 'svelte'

 let ctrl = new SoundGenController();
 onMount(() => {
     ctrl.setupWorklet();
     onDestroy(() => ctrl.stop());
 });
 function randomize () {
     ctrl.randomize();
     ctrl = ctrl;
 }

 function pianoKey (ev: CustomEvent) {
     ctrl.params.gate = ev.detail.down;
     ctrl.params.note = ev.detail.note;
 }
</script>

<Piano on:noteEvent={pianoKey}/>
<Knob bind:value="{ctrl.params.volume}" label="Volume" min="{-72}" max="{0}"/>
<Knob bind:value="{ctrl.params.basePitch}" label="Base Pitch" min="{0}" max="{880}"/>
<section>
    <heading>
        Modulations:
    </heading>
    {#each ctrl.params.oscs as osc, oscIndex}
        {#each osc.modulation as _, modIndex}
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
    {#each ctrl.params.oscs as _osc, oscIndex}
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
