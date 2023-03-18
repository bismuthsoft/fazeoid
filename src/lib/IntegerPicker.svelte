<script lang="ts">
  import knobdrag, {
    makeValueStore,
  } from "@bismuthsoft/svelte-dj-knob/knobdrag";
  import Input from "@bismuthsoft/svelte-dj-knob/Input.svelte";
  // Parameters
  export let min = 0;
  export let max = 10;
  export let step = (max - min) / 1000;
  export let value = (min + max) / 2;

  const valueStore = makeValueStore(
    value,
    (newValue) => (value = Math.floor(newValue + 0.5))
  );
  $: valueStore.set(value);
  let inputElem: any;
  $: knobParams = { min, max, step, valueStore, inputElem };
  // Aesthetic
  export let bgColor = "#fff";
  export let valueColor = "#7f9fff";
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
