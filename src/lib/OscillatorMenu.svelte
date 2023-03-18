<script lang="ts">
  import {
    type Instrument,
    addOscillator,
    removeOscillator,
  } from "$lib/audio/instrument";
  import { createMenu } from "svelte-headlessui";
  import More from "svelte-grommet-icons/lib/More.svelte";
  import AddCircle from "svelte-grommet-icons/lib/AddCircle.svelte";
  import Trash from "svelte-grommet-icons/lib/Trash.svelte";

  export let params: Instrument;
  export let oscIndex: number;
  export let portrait: boolean;

  function addOsc(index: number) {
    params = addOscillator(params, index);
  }

  function removeOsc(index: number) {
    params = removeOscillator(params, index);
  }

  const menu = createMenu({ label: "Oscillator Menu" });

  const entries = [
    {
      icon: AddCircle,
      text: "Add Oscillator Above",
      action: () => addOsc(oscIndex),
    },
    {
      icon: AddCircle,
      text: "Add Oscillator Below",
      action: () => addOsc(oscIndex + 1),
    },
    {
      icon: Trash,
      text: "Remove Oscillator",
      action: () => removeOsc(oscIndex),
    },
  ];

  function onSelect(ev: Event) {
    console.log("onSelect", ev);
  }
</script>

<div style:position="relative">
  <button use:menu.button on:select={onSelect}><More size="small" /></button>
  <div hidden={!$menu.expanded} class="menuPopup">
    <div use:menu.items class="menuItems">
      {#each entries as entry}
        {@const active = $menu.active === entry.text}
        <div class:entry class:active use:menu.item>
          <svelte:component this={entry.icon} />
          {entry.text}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .menuPopup {
    position: absolute;
    margin: 0;
    padding: 0;
    z-index: 2;
  }

  .menuItems {
    position: sticky;
    width: fit-content;
    background-color: #fff;
    margin: 0;
    padding: 1em;
    align-items: flex-start;
    display: flex;
    flex-direction: column;
  }

  .entry {
    width: 100%;
    box-sizing: border-box;
    color: black;
    white-space: nowrap;
    display: flex;
    gap: 0.5em;
    align-items: center;
    padding: 0.5em 0.5em;
    border-radius: 0.5em;
    cursor: pointer;
  }

  .entry :global(path) {
    stroke: black;
  }

  .entry.active {
    background-color: var(--highlight);
  }
</style>
