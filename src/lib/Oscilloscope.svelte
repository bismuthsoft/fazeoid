<script lang="ts">
  export let waveData: number[] = [];

  function generatePath(data: number[]): string {
    const strs: string[] = [];
    data.forEach((d: number, i: number) =>
      strs.push(`${i / (waveData.length - 1)},${-d}`)
    );
    return strs.join(" ");
  }
</script>

<svg class="scope" viewBox="-0.05 -1.25 1.1 2.5" preserveAspectRatio="none">
  <polyline class="scopeLine" points={generatePath(waveData)} />
</svg>

<style>
  .scope {
    background: #0000007f;
    border-radius: 1rem 0;
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
