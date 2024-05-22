<script lang="ts">
  import App from "$lib/App.svelte";
  import { PUBLIC_BACKEND_URL } from "$env/static/public";
  import { page } from "$app/stores";

  import type { Instrument } from "$lib/audio/instrument";
  import { onMount } from "svelte";
	let instrument: Instrument | undefined;

  onMount(async () => {
    try {
      const response = await fetch(`${PUBLIC_BACKEND_URL}/instruments/${$page.params.id}`);
      instrument = await response.json() as any;
    } catch (err: any) {
      console.error("Failed to fetch instrument", err);
    }
  })
</script>

<svelte:head>
  <title>Fazeoid</title>
</svelte:head>

<div class="container">
  {#if !instrument}
    <h1>Loading...</h1>
  {:else}
    <App initialInstrument={instrument} />
  {/if}
</div>

<style>
  .container {
    display: grid;
    grid-gap: 1rem;
    place-items: center;
    height: 100vh;
    width: 100vw;
    color: white;
  }
  :global(body) {
    background: repeat center/20% url(/background.jpg);
    background-attachment: fixed;
  }
</style>
