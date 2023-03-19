<script lang="ts">
  import { createCombobox } from "svelte-headlessui";
  import { ListIcon, CheckIcon } from "svelte-feather-icons";
  import instruments from "$lib/audio/instruments/index.js";
  import type { Instrument } from "$lib/audio/instrument";
  import { migrateInstrument } from "./audio/migration";

  export let params: Instrument;

  const combobox = createCombobox({
    label: "Instruments",
    selected: instruments[0],
  });

  function onSelect(ev: any) {
    params = migrateInstrument(ev.detail.selected.data);
  }

  $: filtered = instruments.filter((istr) =>
    istr.name
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes($combobox.filter.toLowerCase().replace(/\s+/g, ""))
  );
</script>

<div class="presetSelector controlBG">
  <input
    class="presetInput"
    use:combobox.input
    on:select={onSelect}
    value={$combobox.selected.name}
  />
  <div use:combobox.button class="presetButton">
    <ListIcon />
  </div>
  <div hidden={!$combobox.expanded} class="menuPopup">
    <ul class="menuItems" use:combobox.items>
      {#each filtered as entry}
        {@const active = $combobox.active === entry}
        {@const selected = $combobox.selected === entry}
        <li use:combobox.item={{ value: entry }} class="entry" class:active>
          <div style:width="1em" style:height="1em">
            {#if selected}
              <CheckIcon />
            {/if}
          </div>
          {entry.name}
        </li>
      {:else}
        <div class="notFound">"Nothing Found..."</div>
      {/each}
    </ul>
  </div>
</div>

<style>
  .presetSelector {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0;
    flex-grow: 1;
  }
  .presetInput {
    flex-grow: 1;
    background-color: transparent;
    font-size: 1.5em;
    padding-left: 0.5em;
  }
  .presetButton {
    width: 3em;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .menuPopup {
    position: absolute;
    align-self: flex-start;
    width: 100%;
    margin: 0;
    padding: 0;
    z-index: 2;
    top: 100%;
  }

  .menuItems {
    box-sizing: border-box;
    position: relative;
    background-color: #fff;
    width: 100%;
    margin: 0;
    padding: 0.5em;
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    border-radius: 0.5em;
    top: 0;
  }

  .entry {
    box-sizing: border-box;
    color: black;
    white-space: nowrap;
    display: flex;
    gap: 0.5em;
    width: 100%;
    padding: 0.5em 0.5em;
    border-radius: 0.5em;
    cursor: pointer;
  }

  .entry.active {
    background-color: var(--highlight);
  }

  .notFound {
    color: black;
  }
</style>
