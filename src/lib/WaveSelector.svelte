<script lang="ts">
 import type { WaveType } from '$lib/audio/instrument';

 export let wave: WaveType;

 function cycleWave() {
     wave = (() => {
         switch (wave) {
             case 'sine': return 'halfSine';
             case 'halfSine': return 'absSine';
             case 'absSine': return 'triangle';
             case 'triangle': return 'square';
             case 'square': return 'saw';
             case 'saw': return 'sine';
         }
     })();
 }

 const waveNames: Record<WaveType, string> = {
     sine: 'Sine',
     halfSine: 'Half Sine',
     absSine: 'Abs Sine',
     triangle: 'Triangle',
     square: 'Square',
     saw: 'Saw',
 }
</script>

<button class="waveSelect" on:click="{cycleWave}">
    {waveNames[wave]}
</button>

<style>
 .waveSelect {
     width: 4rem;
     height: 3rem;
 }
</style>
