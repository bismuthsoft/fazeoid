<script lang="ts">
 import Knob from "@bismuthsoft/svelte-dj-knob/Knob.svelte";
 import { defaultInstrument, randomizeInstrument } from "$lib/Instrument"
 export let params = defaultInstrument(4);

 function randomize () {
     params = randomizeInstrument(params);
 }
</script>

<Knob bind:value="{params.volume}" label="Volume" min="{-72}" max="{0}"/>
<Knob bind:value="{params.basePitch}" label="Base Pitch" min="{0}" max="{880}"/>
<section>
    <heading>
        Modulations:
    </heading>
    {#each params.oscs as osc, oscIndex}
        {#each osc.modulation as _, modIndex}
            <Knob bind:value="{params.oscs[oscIndex].modulation[modIndex]}"
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
    {#each params.oscs as _osc, oscIndex}
        <Knob bind:value="{params.oscs[oscIndex].pitchRatio}"
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
