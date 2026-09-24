<script lang="ts">
  let { waveData = [] }: { waveData?: number[] } = $props();

  let path = $derived.by(() => {
    const strs: string[] = [];
    waveData.forEach((d: number, i: number) =>
      strs.push(`${i / (waveData.length - 1)},${-d}`)
    );
    return strs.join(" ");
  });
</script>

<svg class="scope" viewBox="-0.05 -1.5 1.1 3" preserveAspectRatio="none">
  <polyline class="scopeLine" points={path} />
</svg>

<style>
  .scope {
    background: var(--background);
    border-radius: 1rem;
  }
  .scopeLine {
    fill: none;
    stroke: white;
    vector-effect: non-scaling-stroke;
    stroke-width: 0.08rem;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
