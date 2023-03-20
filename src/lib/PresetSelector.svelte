<script lang="ts">
  import { createListbox } from "svelte-headlessui";
  import { ChevronDownIcon, CheckIcon, PlusIcon } from "svelte-feather-icons";
  import instruments from "$lib/audio/instruments/index.js";
  import type { Instrument } from "$lib/audio/instrument";
  import { migrateInstrument } from "./audio/migration";

  export let params: Instrument;

  let listItems = [...instruments];
  let defaultInstrument = instruments.find((i) => i.title === "Piano");

  const listbox = createListbox({
    label: "Instruments",
    selected: defaultInstrument,
  });

  function onSelect(ev: any) {
    params = migrateInstrument(ev.detail.selected);
  }

  onSelect({
    detail: { selected: defaultInstrument },
  });
</script>

<div class="presetSelector controlBG">
  <div class="presetListbox" use:listbox.button on:select={onSelect}>
    <div class="presetName">
      {$listbox.selected.title}
    </div>
    <div class="presetButton">
      <ChevronDownIcon />
    </div>
  </div>
  <div hidden={!$listbox.expanded} class="menuPopup">
    <ul class="menuItems" use:listbox.items>
      {#each listItems as entry}
        {@const active = $listbox.active === entry}
        {@const selected = $listbox.selected === entry}
        <li use:listbox.item={{ value: entry }} class="entry" class:active>
          <div class="bullet">
            {#if selected}
              <CheckIcon />
            {/if}
          </div>
          {entry.title}
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .presetSelector {
    position: relative;
    flex-grow: 1;
  }
  .presetListbox {
    align-items: center;
    gap: 0;
    display: flex;
  }
  .presetName {
    background-color: transparent;
    flex-grow: 1;
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
  .bullet {
    width: 1.5em;
    height: 1em;
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
</style>
