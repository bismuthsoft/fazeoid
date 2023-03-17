<script lang="ts">
  import type { EnvelopeParams, EnvelopePoint } from "$lib/audio/envelope";
  import { envelopeToPoints } from "$lib/audio/envelope";

  export let envelope: EnvelopeParams;
  let windowSize = 1.0;
  let windowSizePrinted = 1.0;

  function generatePath(env: EnvelopeParams): string {
    const strs: string[] = [];

    let { points, sustainPoint, release } = envelopeToPoints(envelope);
    let visualPoints = [
      ...points.slice(0, sustainPoint),
      { dx: 0.1, y: points[sustainPoint - 1].y },
      ...points.slice(sustainPoint),
      { dx: 1.0 / release, y: 0 },
    ];

    windowSize = Math.max(
      1,
      visualPoints.reduce((sum, { dx }) => sum + dx, 0)
    );
    windowSizePrinted = Math.floor(windowSize * 100 + 0.5) / 100;
    let x = 0;
    visualPoints.forEach(({ dx, y }: EnvelopePoint) =>
      strs.push(`${((x += dx), x * 1.5) / windowSize},${1 - y}`)
    );
    return strs.join(" ");
  }
</script>

<svg class="scope" viewBox="-0.1 -0.1 1.7 1.4" preserveAspectRatio="none">
  <polyline class="scopeLine" points={generatePath(envelope)} />
  <text x="0" y="1.2" text-anchor="start">0</text>
  <text x="1.5" y="1.2" text-anchor="end">{windowSizePrinted}</text>
</svg>

<style>
  text {
    font-size: 0.2px;
    fill: white;
  }
  .scope {
    background: var(--background);
    min-width: 4rem;
    width: 100%;
    height: 5rem;
    border-radius: 0.5rem;
  }
  .scopeLine {
    fill: none;
    stroke: #ffffbfbf;
    vector-effect: non-scaling-stroke;
    stroke-width: 0.125rem;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
