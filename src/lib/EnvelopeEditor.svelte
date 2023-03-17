<script lang="ts">
  import Knob from "@bismuthsoft/svelte-dj-knob/ElegantKnob.svelte";
  import type { EnvelopeParams, AdsrEnvelope } from "$lib/audio/envelope";

  export let envelope: EnvelopeParams;
  $: adsr = envelope.tag === "adsr" && envelope;

  type PropsEntry = {
    label: Exclude<keyof AdsrEnvelope, "tag">;
    min: number;
    max: number;
  };

  const minLength = 0.005;
  const knobProps: PropsEntry[] = [
    { label: "attack", min: minLength, max: 1 },
    { label: "decay", min: minLength, max: 1 },
    { label: "sustain", min: 0, max: 1 },
    { label: "release", min: minLength, max: 1 },
  ];
</script>

{#if adsr}
  <div class="adsrGrid">
    {#each knobProps as { label, min, max }, index}
      <div class="knobContainer">
        <Knob
          bind:value={adsr[label]}
          {min}
          {max}
          valueColor="#80a0ff"
          size="3.5rem"
          numTicks={0}
        />
      </div>
    {/each}
  </div>
{:else}
  <div>Cannot edit non-ADSR envelope!!!!!!!!!!!</div>
{/if}

<style>
  .adsrGrid {
    grid-gap: 0.5rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-auto-flow: row;
  }
</style>
