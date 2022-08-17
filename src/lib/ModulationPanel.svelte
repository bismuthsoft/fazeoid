<script lang="ts">
 import Knob from "$lib/Knob";
 import type { ComponentProps } from "svelte";
 import type { Instrument } from "./audio/instrument";

 export let params: Instrument;
 export let knobProps: ComponentProps<Knob>;
</script>

<div class="ModulationPanel">
    {#each params.oscs as osc, oscIndex}
        {#each osc.modulation as _, modIndex}
            <div class="knobCell modulationCell" style:grid-area="{oscIndex}/{modIndex}">
                <Knob bind:value="{params.oscs[oscIndex].modulation[modIndex]}"
                      min="{0}" max="{100}"
                      pointerColor="#fe3"
                      {...knobProps}
                      size="5rem"
                />
            </div>
        {/each}
    {/each}
</div>

<style>
 .ModulationPanel {
     display: grid;
 }
</style>
