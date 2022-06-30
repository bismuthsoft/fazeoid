<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    let stop = false;

    onMount(async () => {
        const ac = new AudioContext();
        await ac.audioWorklet.addModule('soundgen.js', { type: 'module' });
        const waveNode = new AudioWorkletNode(ac, 'wave-generator');
        waveNode.connect(ac.destination);
        const p = waveNode.port;
        p.postMessage(['srate', ac.sampleRate]);
        p.postMessage(['freq', 440]);
        let depth = 0;

        let iv = window.setInterval(() => {
            p.postMessage(['modDepth', depth]);
            depth += 1;
            if (stop) {
                p.postMessage('stop');
                window.clearInterval(iv);
            }
        }, 40);
    });

    onDestroy(() => {
        stop = true;
    });
</script>
