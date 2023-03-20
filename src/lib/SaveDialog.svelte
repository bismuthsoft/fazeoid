<script lang="ts">
  import { DownloadIcon } from "svelte-feather-icons";
  import type { Instrument } from "./audio/instrument";

  export let params: Instrument;
  let expanded = false;

  const defaultName = "Untitled Instrument";

  let input: HTMLInputElement;

  function download(filename: string, type: string, data: string) {
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([data], { type }));
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function showDialog() {
    expanded = true;
  }

  function hideDialog() {
    expanded = false;
  }

  function doSave() {
    params.title = input.value || defaultName;
    hideDialog();
    download(
      `${input.value || defaultName}.json`,
      "application/json",
      JSON.stringify(params, null, 2)
    );
  }
</script>

<button title="Save Instrument" on:click={showDialog}>
  <DownloadIcon />
</button>
<div class="modal" style:visibility={expanded ? "visible" : "hidden"}>
  <h2>Save Instrument As...</h2>
  <input on:submit={doSave} bind:this={input} value={defaultName} />
  <div>
    <button on:click={doSave} class="saveButton">Save</button>
    <button on:click={hideDialog} class="saveButton">Cancel</button>
  </div>
</div>

<style>
  .modal {
    background-color: #888888af;
    backdrop-filter: blur(5px);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5em;
    border-radius: 1em;
    transition: 0.3s;
  }

  input {
    font-size: 2em;
    padding: 1em;
    margin: 0;
  }

  h2 {
    font-size: 2em;
    margin: 0;
  }

  .saveButton {
    font-size: 2em;
    margin: 0 0.5em;
    padding: 0.5em;
  }
</style>
