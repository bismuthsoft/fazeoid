<script lang="ts">
 import { defaultInstrument } from "$lib/audio/instrument"
 import AudioController from "$lib/audio/Controller"
 import InstrumentPanel from "$lib/InstrumentPanel.svelte"

 import { onDestroy } from 'svelte'
 import { writable } from 'svelte/store'

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
</script>

<InstrumentPanel bind:params="{$instrument}" on:noteUp="{noteUp}" on:noteDown="{noteDown}"/>
