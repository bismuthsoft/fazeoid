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
 let innerWidth: number;
 $: portrait = innerWidth < 920;
</script>

<svelte:window bind:innerWidth />

<div class="App">
    <Titlebar bind:params={$instrument} />
    <InstrumentPanel bind:params="{$instrument}" {portrait} />
    <Piano on:noteUp="{noteUp}" on:noteDown="{noteDown}" {portrait} />
</div>

<style>
 .App {
     font-family: Genos, Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
     font-weight: 700;
     font-style: italic;
     font-display: block;
     display: flex;
     flex-direction: column;
     gap: .5rem;
     padding: 0.5rem;
     border-radius: 1em;
     background: var(--bg-color);
     --bg-color: #0000;
     backdrop-filter: brightness(0.5) contrast(0.8) hue-rotate(0.90turn) blur(5px);
     color: white;
     filter: drop-shadow(4px 4px 10px #3338);
 }
 /* latin-ext */
 @font-face {
     font-family: 'Genos';
     size-adjust: 120%;
     font-style: italic;
     font-weight: 700;
     font-display: swap;
     src: url(https://fonts.gstatic.com/s/genos/v6/SlGPmQqPqpUOYRwqWzksdKTv0zsAYgvn6Xi3A7JMAg.woff2) format('woff2');
     unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
 }
 /* latin */
 @font-face {
     font-family: 'Genos';
     size-adjust: 120%;
     font-style: italic;
     font-weight: 700;
     font-display: swap;
     src: url(https://fonts.gstatic.com/s/genos/v6/SlGPmQqPqpUOYRwqWzksdKTv0zsAYgvn6Xi5A7I.woff2) format('woff2');
     unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
 }
</style>
