<script lang="ts">
  import { onMount } from "svelte";
  import Modal from "./Modal.svelte";
  let warning = false;

  onMount(() => {
    const ua = window.navigator.userAgent;
    warning =
      ua.indexOf("Chrome") === -1 &&
      ua.indexOf("Chromium") === -1 &&
      !(ua.indexOf("Firefox") > 0 && ua.indexOf("Android") === -1);
  });
</script>

<Modal expanded={warning}>
  <div class="warning" on:click={() => (warning = false)}>
    <h2>
      <p>Warning: Unsupported browser.</p>
      <p>
        Since WebAudioWorkletAPI is fairly new, and touch input is inconsistent
        accross platforms. You may experience issues such as stuck notes or
        crackling audio.
      </p>
      <p>
        <a href="https://github.com/bismuthsoft/fazeoid#readme"
          >Click here for a list of supported browsers.</a
        >
      </p>
      <p>Click anywhere to continue.</p>
    </h2>
  </div>
</Modal>

<style>
  .warning {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #00000030;
    width: 100%;
    height: 100%;
    padding: 3em;
  }

  h2 {
    max-width: 800px;
    text-align: center;
  }
</style>
