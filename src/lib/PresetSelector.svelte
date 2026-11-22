<script lang="ts">
  import instruments from "#lib/audio/instruments/index.js";
  import type { Instrument } from "#lib/audio/instrument.js";
  import { migrateInstrument } from "./audio/migration";

  let { params = $bindable<Instrument>() }: { params: Instrument } = $props();

  function selectPreset(title: string) {
    const preset = instruments.find((i) => i.title === title);
    if (!preset) return;
    // clone: presets are shared module-level objects; migrateInstrument mutates
    // in place, and without a clone a saved instrument renames the shared preset.
    params = migrateInstrument(JSON.parse(JSON.stringify(preset)));
  }
</script>

<div class="presetSelector controlBG">
  <select
    class="presetName"
    value={params.title}
    onchange={(e) => selectPreset((e.currentTarget as HTMLSelectElement).value)}
  >
    {#if params.title && !instruments.some((i) => i.title === params.title)}
      <option value={params.title}>{params.title}</option>
    {/if}
    {#each instruments as preset}
      <option value={preset.title}>{preset.title}</option>
    {/each}
  </select>
</div>

<style>
  .presetSelector {
    position: relative;
    flex-grow: 1;
  }
  .presetName {
    box-sizing: border-box;
    width: 100%;
    background-color: transparent;
    flex-grow: 1;
    font-size: 1.5em;
    padding-left: 0.5em;
    /* UA form controls don't inherit color: without this the value renders in
       the system colour on the dark controlBG. */
    color: white;
  }
  /* The native dropdown is painted by the UA, which does not pick up the
     select's transparent background, so state the app's colours outright
     instead of leaning on color-scheme and the system theme. */
  .presetName option {
    color: white;
    background-color: var(--background-opaque);
  }
</style>
