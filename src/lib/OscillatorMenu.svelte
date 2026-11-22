<script lang="ts">
  import {
    type Instrument,
    addOscillator,
    removeOscillator,
  } from "#lib/audio/instrument.js";
  import {
    MoreVerticalIcon,
    PlusCircleIcon,
    TrashIcon,
  } from "svelte-feather-icons";

  let {
    params = $bindable<Instrument>(),
    oscIndex,
    rightmostPortrait,
  }: {
    params: Instrument;
    oscIndex: number;
    rightmostPortrait: boolean;
  } = $props();

  let open = $state(false);
  let active = $state("");
  let container: HTMLDivElement = $state()!;

  function addOsc(index: number) {
    params = addOscillator(params, index);
  }

  function removeOsc(index: number) {
    params = removeOscillator(params, index);
  }

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

  $effect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!container?.contains(e.target as Node)) open = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") open = false;
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  });
</script>

<div style:position="relative" bind:this={container}>
  <button onclick={() => (open = !open)}><MoreVerticalIcon /></button>
  <div hidden={!open} class="menuPopup">
    <div class="menuItems" class:rightmostPortrait>
      {#each entries as entry}
        <div
          class:entry
          class:active={active === entry.text}
          onmouseenter={() => (active = entry.text)}
          onclick={() => {
            entry.action();
            open = false;
          }}
        >
          <entry.icon />
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

  /* Hack to keep menu on screen */
  .rightmostPortrait {
    right: 80%;
  }

  .menuItems {
    position: relative;
    background-color: #fff;
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
    align-items: center;
    width: 100%;
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
