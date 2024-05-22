<script lang="ts">
  import { randomizeInstrument, type Instrument } from "./audio/instrument";
  import { migrateInstrument } from "./audio/migration";
  import {
    ShuffleIcon,
    UploadIcon,
    DownloadIcon,
    HelpCircleIcon,
  } from "svelte-feather-icons";
  import PresetSelector from "./PresetSelector.svelte";
  import SaveButton from "$lib/SaveButton.svelte";

  export let params: Instrument;

  function randomize() {
    params = randomizeInstrument(params);
  }
  function uploadInstrument() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.style.display = "none";
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
    input.addEventListener("change", async (e) => {
      const files = (e.currentTarget as HTMLInputElement).files || [];
      const match = files[0].name.match(/(.*)\.json/);
      const filename = match ? match[1] : files[0].name;
      const instrumentData = JSON.parse(await files[0].text());
      // Migrate instruments to 0.0.3 onwards
      if (!instrumentData.title) instrumentData.title = filename;
      params = migrateInstrument(instrumentData);
    });
    // TODO investigate: do we need to remove the event listener?
  }
</script>

<div class="titlebar">
  <a
    href="https://github.com/bismuthsoft/fazeoid"
    title="Fazeoid"
    style:height="2em"
    style:margin=".25em .25em"
  >
    <img alt="Fazeoid" src="/fazeoid.svg" height="100%" />
  </a>
  <!-- <PresetSelector bind:params /> -->
  <button title="Randomize" on:click={randomize}>
    <ShuffleIcon />
  </button>
  <SaveButton {params} />
  <button title="Load Instrument" on:click={uploadInstrument}>
    <UploadIcon />
  </button>
  <a href="https://github.com/bismuthsoft/fazeoid#readme">
    <button title="Help" class="helpbutton">
      <HelpCircleIcon />
    </button>
  </a>
</div>

<style>
  .titlebar {
    padding: inherit;
    display: flex;
    gap: 0.3em;
  }
  .helpbutton {
    height: 100%;
    background: #0088dd7f;
  }
  .helpbutton:hover {
    background: #0088ddff;
  }
</style>
