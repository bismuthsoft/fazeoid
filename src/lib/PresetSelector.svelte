<script lang="ts">
  import { createListbox } from "svelte-headlessui";
  import { ChevronDownIcon, CheckIcon, PlusIcon } from "svelte-feather-icons";
  import instruments from "$lib/audio/instruments/index.js";
  import type { Instrument } from "$lib/audio/instrument";
  import { migrateInstrument } from "./audio/migration";

  export let params: Instrument;

  //let NEW_INSTRUMENT = "New Instrument...";
  let listItems = [...instruments]; ///[...instruments, { name: NEW_INSTRUMENT } as any];
  let input: HTMLInputElement;

  const listbox = createListbox({
    label: "Instruments",
    selected: instruments[0],
  });

  function onSelect(ev: any) {
    // if (ev.detail.selected.name === NEW_INSTRUMENT) {
    //   console.log("new instrument");
    //   console.log(input.value);
    //   return;
    // }
    params = migrateInstrument(ev.detail.selected.data);
  }

  function clearInput() {
    input.value = "";
    input.focus();
  }

  function newInstrument() {}
</script>

<div class="presetSelector controlBG">
  <div class="presetListbox" use:listbox.button on:select={onSelect}>
    <div class="presetName">
      {$listbox.selected.name}
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
        <!-- {@const newInstrument = entry.name === NEW_INSTRUMENT} -->
        <li use:listbox.item={{ value: entry }} class="entry" class:active>
          <div class="bullet">
            {#if selected}
              <CheckIcon />
              <!-- {:else if newInstrument}
              <PlusIcon /> -->
            {/if}
          </div>
          {entry.name}
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
