<script lang="ts">
 import { defaultInstrument } from "$lib/audio/instrument"
 import AudioController from "$lib/audio/Controller"
 import InstrumentPanel from "$lib/InstrumentPanel.svelte"
 import Piano from "$lib/piano/Piano.svelte";

 import { onDestroy } from 'svelte'
 import { writable } from 'svelte/store'
 import Titlebar from "./Titlebar.svelte";

 let instrument = writable(defaultInstrument(4));

 let ctrl = new AudioController();
 let hackInitialize = false;
 instrument.subscribe((value) => {
     ctrl.postMessage('setInstrument', 0, value);
 });

 onDestroy(() => ctrl.stop());

 function noteUp (ev: CustomEvent) {
     if (!hackInitialize) {
         ctrl.audioContext?.resume();
         hackInitialize = true;
     }
     ctrl.postMessage('noteUp', ev.detail);
 }

 function noteDown (ev: CustomEvent) {
     if (!ctrl.started) {
         ctrl.started = true;
         ctrl.setupWorklet();
     }
     ctrl.postMessage('noteDown', ev.detail);
 }
 let innerWidth: number,
     innerHeight: number;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="App">
    <Titlebar bind:params={$instrument} />
    <InstrumentPanel
        bind:params="{$instrument}"
        on:noteUp="{noteUp}" on:noteDown="{noteDown}"
        portrait="{innerWidth/innerHeight < 1}"
    />
    <Piano on:noteUp="{noteUp}" on:noteDown="{noteDown}"/>
</div>

<style>
 .App {
     display: flex;
     flex-direction: column;
     gap: .5rem;
     border: solid #333 0.2rem;
     border-radius: .5em;
     background: var(--bg-color);
     --bg-color: #0000;
     backdrop-filter: brightness(0.5) contrast(0.8) hue-rotate(0.90turn) blur(5px);
     color: white;
     filter: drop-shadow(4px 4px 10px #3338);
 }

</style>
