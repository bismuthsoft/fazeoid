<script lang="ts">
 import type { WaveType } from '$lib/audio/instrument';
 import WaveIcon from "$lib/WaveIcon.svelte";

 export let wave: WaveType;
 export let portrait: boolean;

 const waves: WaveType[] = ['sine', 'halfSine', 'absSine', 'triangle', 'square', 'saw'];
</script>

<div class="waveSelect" class:portrait>
    {#each waves as value}
        <button on:click="{() => wave = value}">
            <WaveIcon wave="{value}" selected="{value === wave}"/>
        </button>
    {/each}
</div>

<style>
 .waveSelect {
     display: grid;
     grid-auto-flow: row;
     grid-template-columns: 1fr 1fr;
     grid-gap: 0.2em;
 }

 .waveSelect.portrait {
     grid-template-columns: 1fr 1fr 1fr;
 }

 button {
     width: 3em;
     height: 2em;
     padding: 0.2em;
 }
</style>
