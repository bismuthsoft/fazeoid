<script lang="ts">
 import Piano from "$lib/piano/Piano.svelte"
 import {defaultInstrument} from "$lib/Instrument"
 import InstrumentPanel from "$lib/InstrumentPanel.svelte"
 import WorkletWrapper from "$lib/WorkletWrapper"

 import { onMount, onDestroy } from 'svelte'

 let instrument = defaultInstrument(4);

 let ctrl = new WorkletWrapper();
 onMount(() => {
     ctrl.setupWorklet();
 });

 onDestroy(() => ctrl.stop());

 function noteUp (ev: CustomEvent) {
     ctrl.postMessage('setInstrument', 0, instrument)
     ctrl.postMessage('noteUp', ev.detail);
 }

 function noteDown (ev: CustomEvent) {
     ctrl.postMessage('setInstrument', 0, instrument)
     ctrl.postMessage('noteDown', ev.detail);
 }
</script>

<div class="container">
    <InstrumentPanel bind:params="{instrument}"/>
    <Piano on:noteUp="{noteUp}" on:noteDown="{noteDown}"/>
</div>

<style>
 .container {
     display: flex;
     flex-direction: column;
     height: 100vh;
     width: 100vw;
     align-items: center;
     justify-content: space-between;
 }
</style>
