<script lang="ts">
 import Piano from "$lib/piano/Piano.svelte"
 import InstrumentPanel from "$lib/InstrumentPanel.svelte"
 import {SoundGenController} from "$lib/SoundGenController.js"

 import { onMount, onDestroy } from 'svelte'

 let ctrl = new SoundGenController();
 onMount(() => {
     ctrl.setupWorklet();
     onDestroy(() => ctrl.stop());
 });

 function noteUp (ev: CustomEvent) {
     ctrl.noteUp(ev.detail);
 }

 function noteDown (ev: CustomEvent) {
     ctrl.noteDown(ev.detail);
 }
</script>

<Piano on:noteUp="{noteUp}" on:noteDown="{noteDown}"/>
<InstrumentPanel bind:params="{ctrl.params.instruments[0]}"/>
