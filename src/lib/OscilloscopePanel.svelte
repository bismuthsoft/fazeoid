<script lang="ts">
  import type { Instrument, Note } from "#lib/audio/instrument.js";
  import { flatEnvelope } from "#lib/audio/envelope.js";
  import Voice from "#lib/audio/Voice.js";
  import Oscilloscope from "./Oscilloscope.svelte";

  let {
    instrument,
    zoom = 0.25, // How many periods to show
  }: { instrument: Instrument; zoom?: number } = $props();

  const resolution = 400;
  let sampleRate = $derived(zoom * resolution * 440);

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
  let flatInstrument = $derived({
    ...instrument,
    oscs: instrument.oscs.map((o) => ({
      ...o,
      envelope: flatEnvelope(1, 0),
    })),
  });

  let voice = $derived(new Voice(flatInstrument, note, sampleRate));
  let oscData = $derived(getOscillators(voice));

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
    display: grid;
    width: calc(33% - 1rem);
  }
  .container :global(svg) {
    width: 100%;
    height: 6rem;
  }
  .label {
    z-index: 2;
    grid-area: 1 / 1;
    width: 1.5em;
    border-radius: 0.4em;
    text-align: center;
  }
  .content {
    grid-area: 1 / 1 / 4 / 1;
    flex-grow: 1;
  }
  @media (min-width: 920px) {
    .label {
      width: calc(50% - 1rem);
      display: none;
    }
    .container {
      width: 10rem;
    }
  }
</style>
