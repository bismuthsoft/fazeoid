<script lang="ts">
  import knobdrag from "#dj-knob/knobdrag.js";
  import Input from "#dj-knob/Input.svelte";

  // Parameters
  let {
    min = 0,
    max = 10,
    step = (max - min) / 1000,
    value = $bindable((min + max) / 2),
    // Aesthetic
    bgColor = "#fff",
  }: {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    bgColor?: string;
  } = $props();

  let inputElem = $state<HTMLInputElement | undefined>();
  let knobParams = $derived({
    min,
    max,
    step,
    getValue: () => value,
    // the picker is integer-only: snap whatever the drag produces
    setValue: (newValue: number) => (value = Math.floor(newValue + 0.5)),
    inputElem,
  });
</script>

<div
  style:display="flex"
  style:flex-direction="column"
  style:align-items="center"
>
  <div class="background controlBG" use:knobdrag={knobParams}>
    <Input bind:value bind:inputElem color={bgColor} />
  </div>
</div>

<style>
  .background :global(input) {
    font-size: 1em;
  }
  .background {
    display: flex;
    width: 1.5em;
    height: 1.5em;
    pointer-events: painted;
  }
</style>
