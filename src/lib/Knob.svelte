<script lang="ts">
  import knobdrag from "#dj-knob/knobdrag.js";
  import Input from "#dj-knob/Input.svelte";

  // Parameters
  let {
    min = 0,
    max = 100,
    step = (max - min) / 100,
    value = $bindable((min + max) / 2),
    // Aesthetic
    size = "5rem",
    fgColor = "#ffffff",
    valueColor = "#ffffff",
    label = undefined as string | undefined,
    numTicks = 6,
  }: {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    size?: string;
    fgColor?: string;
    valueColor?: string;
    label?: string;
    numTicks?: number;
  } = $props();

  let inputElem = $state<HTMLInputElement | undefined>();
  let knobParams = $derived({
    min,
    max,
    step,
    getValue: () => value,
    setValue: (newValue: number) => (value = newValue),
    inputElem,
  });

  // Visual math functions
  const visualRange = 270;
  const visualStartPoint = 135;
  const normalizeValue = (value: number) => (value - min) / (max - min);
  const angleOnKnob = (normValue: number) =>
    normValue * visualRange + visualStartPoint;
  const valueOnKnob = (value: number) => angleOnKnob(normalizeValue(value));
  let ticks = $derived(
    Array(numTicks)
      .fill(0)
      .map((_, i) => ({
        angle: angleOnKnob(numTicks === 1 ? 0.5 : i / (numTicks - 1)),
      }))
  );
</script>

<div class="ElegantKnob" style:width={size}>
  <div class="value" style:font-size="calc({size} / 5)">
    <Input bind:value bind:inputElem color={fgColor} />
  </div>
  <svg
    viewBox="0 0 10 8.6"
    width={size}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      class="background controlBG"
      use:knobdrag={knobParams}
      d="M 8.5,8.6 A 5,5 0 1 0 1.5,8.6"
    />
    {#if value >= min && value <= max}
      <path
        class="pointer"
        style:fill={valueColor}
        transform="rotate({valueOnKnob(value)}, 5, 5)"
        d="M 9.5640408,5.0000863 8.8569772,5.7071499 c -0.3904906,0.3904906 -1.0236127,0.3904669 -1.4141272,2e-7 -0.3904668,-0.3905145 -0.3904667,-1.0236129 1e-7,-1.4141273 0.3905144,-0.3904667 1.0236366,-0.3904906 1.4141272,0 z"
      />
    {/if}
    <g class="ticks">
      {#each ticks as { angle }}
        <path
          stroke={fgColor}
          d="M 8.5,5 9,5"
          transform="rotate({angle}, 5, 5)"
        />
      {/each}
    </g>
  </svg>
  {#if label}
    <nobr style:font-size="calc({size} / 5)">
      {label}
    </nobr>
  {/if}
</div>

<style>
  .ElegantKnob {
    display: inline-grid;
    grid-auto-flow: row;
    place-items: center;
    pointer-events: none;
  }
  .background {
    pointer-events: all;
    cursor: pointer;
  }
  svg,
  .value {
    grid-area: 1/1;
  }
  .value {
    position: relative;
    top: 6.5%;
    width: 50%;
  }
  .value :global(input) {
    padding: 0;
    font-size: 100%;
  }
  .ticks {
    stroke-width: 0.2px;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
    opacity: 0.5;
  }
</style>
