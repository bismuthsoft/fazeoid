<script lang="ts">
  import {
    type Instrument,
    addOscillator,
    removeOscillator,
  } from "$lib/audio/instrument";
  import { createMenu } from "svelte-headlessui";
  import {
    MoreVerticalIcon,
    PlusCircleIcon,
    TrashIcon,
  } from "svelte-feather-icons";

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
      icon: PlusCircleIcon,
      text: "Add Oscillator Above",
      action: () => addOsc(oscIndex),
    },
    {
      icon: PlusCircleIcon,
      text: "Add Oscillator Below",
      action: () => addOsc(oscIndex + 1),
    },
    {
      icon: TrashIcon,
      text: "Remove Oscillator",
      action: () => removeOsc(oscIndex),
    },
  ];

  function onSelect(ev: Event) {
    console.log("onSelect", ev);
  }
</script>

<div style:position="relative">
  <button use:menu.button on:select={onSelect}><MoreVerticalIcon /></button>
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
    position: absolute;
    background-color: #fff;
    margin: 0;
    padding: 0.5em;
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    border-radius: 0.5em;
    top: 0;
    left: 50%;
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
