<script lang="ts">
  import type { Instrument, Note } from "$lib/audio/instrument";
  import { flatEnvelope } from "$lib/audio/envelope";
  import Voice from "$lib/audio/Voice";
  import Oscilloscope from "./Oscilloscope.svelte";

  export let instrument: Instrument;
  export let zoom = 0.25; // How many periods to show
  export let portrait: boolean;

  let resolution = 400;
  $: sampleRate = zoom * resolution * 440;

  function rotateData<T>(data: T[][]): T[][] {
    return Array(data[0].length)
      .fill(0)
      .map((_, i) => data.map((row) => row[i]));
  }

  function getOscillators(voice: Voice): number[][] {
    const oscData = Array(resolution)
      .fill(0)
      .map(() => voice.getOscillators())
      .slice(1);
    return rotateData(oscData);
  }

  const note: Note = { note: 57, instrumentIndex: 0 };
  $: flatInstrument = {
    ...instrument,
    oscs: instrument.oscs.map((o) => ({
      ...o,
      envelope: flatEnvelope(1, 0),
    })),
  };

  $: voice = new Voice(flatInstrument, note, sampleRate);
  $: oscData = getOscillators(voice);

  // Maybe useful: shifting
  // const shiftRate = 60; // FPS of shifting by 1 sample
  // setInterval(() => {
  //     let nextSamples = voice.getOscillators();
  //     oscData = oscData.map((row, index) => {
  //         row.shift();
  //         row.push(nextSamples[index]);
  //         return row;
  //     })
  // }, 1000 / shiftRate);
</script>

{#each oscData as data, index}
  <div class="container">
    <div class="label">{index + 1}</div>
    <div class="content">
      <Oscilloscope waveData={data} />
    </div>
  </div>
{/each}

<style>
  .container {
    display: flex;
    align-items: center;
    width: calc(50% - 1rem);
  }
  .container :global(svg) {
    width: 100%;
    height: 6rem;
  }
  .label {
    width: 1.2em;
  }
  .content {
    flex-grow: 1;
  }
  @media (min-width: 920px) {
    .label {
      display: none;
    }
    .container {
      width: 10rem;
    }
  }
</style>
