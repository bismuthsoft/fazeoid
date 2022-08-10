<script lang="ts">
 import Knob from '@bismuthsoft/svelte-dj-knob';
 import type { EnvelopeParams, AdsrEnvelope } from '$lib/soundgen/envelope';

 export let envelope: EnvelopeParams;
 $: adsr = envelope.tag === 'adsr' && envelope;

 type PropsEntry = {
     label: Exclude<keyof AdsrEnvelope, 'tag'>,
     min: number,
     max: number
 };

 const knobProps: PropsEntry[] = [
     {label: "attack", min: 1, max: 20},
     {label: "decay", min: 1, max: 20},
     {label: "sustain", min: 0, max: 1},
     {label: "release", min: 1, max: 20},
 ]
</script>

{#if adsr}
    <div class="adsrGrid">
        {#each knobProps as {label, min, max}, index}
            <div class="knobContainer"
                 style:grid-area="{1 + index % 2} / {1 + Math.floor(index/2)}"
            >
                <Knob bind:value="{adsr[label]}" min="{min}" max="{max}"
                      bgColor="#333" fgColor="#D88" size="2.5rem"/>
            </div>
        {/each}
    </div>
{:else}
    <div>Cannot edit non-ADSR envelope!!!!!!!!!!!</div>
{/if}

<style>
 .adsrGrid {
     display: grid;
}
</style>
