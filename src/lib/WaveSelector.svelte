<script lang="ts">
  import type { WaveType } from "$lib/audio/instrument";
  import WaveIcon from "$lib/WaveIcon.svelte";

  let {
    wave = $bindable<WaveType>(),
    portrait,
  }: {
    wave: WaveType;
    portrait: boolean;
  } = $props();

  const waves: WaveType[] = [
    "sine",
    "absSine",
    "halfSine",
    "pulseSine",
    "square",
    "saw",
  ];
</script>

<div class="waveSelect" class:portrait>
  {#each waves as value}
    <button onclick={() => (wave = value)}>
      <WaveIcon wave={value} selected={value === wave} />
    </button>
  {/each}
</div>

<style>
  .waveSelect {
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.2em;
  }

  .waveSelect.portrait {
    grid-auto-flow: column;
    grid-template-rows: 1fr 1fr;
  }

  button {
    width: 3em;
    height: 2em;
    padding: 0.2em;
  }
</style>
