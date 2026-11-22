<script lang="ts">
  import { sineWave } from "#lib/audio/instrument.js";
  import type { Instrument, Note } from "#lib/audio/instrument.js";
  import instruments from "#lib/audio/instruments/index.js";
  import { migrateInstrument } from "#lib/audio/migration.js";
  import VERSION from "#lib/version.js";
  import AudioController from "#lib/audio/Controller.js";
  import InstrumentPanel from "#lib/InstrumentPanel.svelte";
  import UserAgentWarn from "./UserAgentWarn.svelte";
  import Piano from "#lib/piano/Piano.svelte";

  import { onDestroy } from "svelte";
  import Titlebar from "./Titlebar.svelte";

  function defaultInstrument(): Instrument {
    const preset = instruments.find((i) => i.title === "Piano");
    if (!preset) return sineWave(1);
    // Clone: presets are shared module-level objects and migrateInstrument
    // mutates in place.
    return migrateInstrument(JSON.parse(JSON.stringify(preset)));
  }

  let instrument = $state(defaultInstrument());

  let ctrl = new AudioController();
  let hackInitialize = false;

  $effect(() => {
    // JSON round-trip: (a) deep-reads the $state proxy so ANY nested change
    // re-triggers this effect, (b) produces a plain object — $state proxies
    // must never be postMessage'd.
    const snapshot = JSON.parse(JSON.stringify(instrument));
    ctrl.postMessage("setInstrument", 0, snapshot);
  });

  onDestroy(() => ctrl.stop());

  function noteUp(note: Note) {
    if (!hackInitialize) {
      ctrl.audioContext?.resume();
      hackInitialize = true;
    }
    ctrl.postMessage("noteUp", note);
  }

  function noteDown(note: Note) {
    if (!ctrl.started) {
      ctrl.started = true;
      ctrl.setupWorklet();
    }
    ctrl.postMessage("noteDown", note);
  }

  let innerWidth = $state(0);
  let portrait = $derived(innerWidth < 920);
</script>

<svelte:window bind:innerWidth />

<div class="App">
  <Titlebar bind:params={instrument} />
  <InstrumentPanel bind:params={instrument} {portrait} />
  <Piano
    onnotedown={noteDown}
    onnoteup={noteUp}
    onclear={() => ctrl.postMessage("clear")}
    {portrait}
  />
  <footer>
    <div>Fazeoid {VERSION}</div>
    <div>Copyright © 2022 BismuthSoft</div>
  </footer>
</div>

<UserAgentWarn />

<style>
  .App {
    font-family: Genos, Impact, Haettenschweiler, "Arial Narrow Bold",
      sans-serif;
    font-display: block;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 1em;
    background: var(--bg-color);
    --bg-color: #0000007f;
    backdrop-filter: blur(5px);
    color: white;
    box-shadow: 0 0 10px #3338;
  }
  @media (max-width: 680px) {
    .App {
      border-radius: 0;
    }
  }
  footer {
    padding: 0em 0.5em;
    display: flex;
    justify-content: space-between;
    letter-spacing: 0.2rem;
    user-select: none;
  }
  /* latin */
  @font-face {
    font-family: "Genos";
    size-adjust: 120%;
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/genos/v6/SlGNmQqPqpUOYTYjacb0Hc91fTwVqkjYqki7.woff2)
      format("woff2");
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
      U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212,
      U+2215, U+FEFF, U+FFFD;
  }
  /* latin-ext */
  @font-face {
    font-family: "Genos";
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/genos/v6/SlGNmQqPqpUOYTYjacb0Hc91fTwVqkjYpEi7G7Y.woff2)
      format("woff2");
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
      U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
</style>
