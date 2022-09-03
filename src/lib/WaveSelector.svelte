<script lang="ts">
 import type { WaveType } from '$lib/audio/instrument';

 export let wave: WaveType;

 const waveNames: Record<WaveType, string> = {
     sine: 'Sine',
     halfSine: 'Half Sine',
     absSine: 'Abs Sine',
     triangle: 'Triangle',
     square: 'Square',
     saw: 'Saw',
 }
</script>

<select bind:value="{wave}">
    {#each Object.entries(waveNames) as [value, name]}
        <option {value}>{name}</option>
    {/each}
</select>

<style>
 select {
     width: 6rem;
     height: 3rem;
     padding: .125rem;
 }
</style>
