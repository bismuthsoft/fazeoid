<script lang="ts">
	import Slider from "$lib/Slider.svelte"
	import Knob from "$lib/Knob.svelte"

    import { onMount, onDestroy } from 'svelte'
    let stop = false;
    let pitch = 2200;
    let pitchRatio = 0.5;
    let depth = 1;

    onMount(async () => {
        const ac = new AudioContext();
        await ac.audioWorklet.addModule('soundgen.js', { type: 'module' });
        const waveNode = new AudioWorkletNode(ac, 'wave-generator');
        waveNode.connect(ac.destination);
        const p = waveNode.port;
        p.postMessage(['srate', ac.sampleRate]);

        let iv = window.setInterval(() => {
//            p.postMessage(['freq', 400]);
            p.postMessage(['freq', pitch]);
            p.postMessage(['modDepth', depth]);
            p.postMessage(['carPitchRatio', pitchRatio]);
            if (stop) {
                p.postMessage('stop');
                window.clearInterval(iv);
            }
        }, 16);
    });

    onDestroy(() => {
        stop = true;
    });
</script>

<!--<Slider bind:value="{pitch}" label="Pitch" min="{20}" max="{8000}" log=true/>-->
<Knob bind:value="{pitch}" label="Pitch" min="{20}" max="{8000}" log=true/>
<Slider bind:value="{depth}" label="Depth" min="{0}" max="{1000}" log=true/>
<Slider bind:value="{pitchRatio}" label="PitchRatio" min="{0.01}" max="{10}" log=true/>
