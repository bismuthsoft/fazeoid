<script lang="ts">
 import Piano from "$lib/piano/Piano.svelte"
 import {defaultInstrument} from "$lib/soundgen/instrument"
 import InstrumentPanel from "$lib/InstrumentPanel.svelte"
 import WorkletWrapper from "$lib/WorkletWrapper"

 import { onDestroy } from 'svelte'
 import { writable } from 'svelte/store'

 let instrument = writable(defaultInstrument(4));

 let ctrl = new WorkletWrapper();

 onDestroy(() => ctrl.stop());

 function noteUp (ev: CustomEvent) {
     ctrl.postMessage('noteUp', ev.detail);
 }

 function noteDown (ev: CustomEvent) {
     if (!ctrl.started) {
         ctrl.setupWorklet().then(() => {
             instrument.subscribe((value) => {
                 ctrl.postMessage('setInstrument', 0, value);
             });
             noteDown(ev);
         });
     }
     ctrl.postMessage('noteDown', ev.detail);
 }
</script>

<div class="container">
    <h1>
        FMSite
    </h1>
    <InstrumentPanel bind:params="{$instrument}"/>
    <Piano on:noteUp="{noteUp}" on:noteDown="{noteDown}"/>
</div>

<style>
 h1 {
     margin: 0;
     padding: 1em;
     background: #eee;
     width: 100%;
     text-align: center;
 }
 .container {
     display: flex;
     flex-direction: column;
     height: 100vh;
     width: 100vw;
     align-items: center;
     justify-content: space-between;
 }
</style>
