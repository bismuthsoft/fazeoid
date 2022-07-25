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
     window.setInterval(() => {
         ctrl.postMessage('setInstrument', 0, instrument);
     }, 16)
 });

 onDestroy(() => ctrl.stop());

 function noteUp (ev: CustomEvent) {
     ctrl.postMessage('noteUp', ev.detail);
 }

 function noteDown (ev: CustomEvent) {
     ctrl.postMessage('noteDown', ev.detail);
 }
</script>

<Piano on:noteUp="{noteUp}" on:noteDown="{noteDown}"/>
<InstrumentPanel bind:params="{instrument}"/>
