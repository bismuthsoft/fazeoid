<script lang="ts">
 import type { ComponentProps } from "svelte";
 import type { Instrument } from "./audio/instrument";
  import Knob from "$lib/Knob.svelte";

 export let params: Instrument;
 export let knobProps: ComponentProps<Knob>;
 export let portrait: boolean;

 $: gridArea = portrait ? (
     (row: number, column: number) => `${column}/${row}`
 ) : (
     (row: number, column: number) => `${row}/${column}`
 )
</script>

<div class="ModulationPanel">
    {#each params.oscs as osc, oscIndex}
        {#each osc.modulation as _, modIndex}
            <div style:grid-area="{gridArea(oscIndex+1, modIndex+1)}">
                <Knob bind:value="{params.oscs[oscIndex].modulation[modIndex]}"
                      min="{0}" max="{100}"
                      {...knobProps}
                      size="5rem"
                      valueColor="#fe3"
                />
            </div>
        {/each}
        {#if oscIndex < params.oscs.length - 1}
            <div class="arrow" style:grid-area="{gridArea(oscIndex+1, oscIndex+1)}">
                {oscIndex+1}
                {portrait?'→':'↓'}
            </div>
        {/if}
    {/each}
</div>


<style>
 .ModulationPanel {
     display: grid;
     grid-gap: .5rem;
     border-radius: 0 0 .5em .5em;
     grid-auto-rows: 1fr;
     grid-auto-columns: 1fr;
     grid-auto-flow: row;
     place-items: center;
     width: 100%;
     height: 100%;

 }
 .arrow {
     font-size: 2rem;
 }
</style>
