<script lang="ts">
  import type { Action } from "svelte/action";
  import type { Writable } from "svelte/store";
  import knobdrag, {
    makeValueStore,
  } from "@bismuthsoft/svelte-dj-knob/knobdrag";
  import Input from "@bismuthsoft/svelte-dj-knob/Input.svelte";

  // dj-knob's Params type is not exported; mirror it locally with inputElem
  // optional (it is briefly undefined until Input mounts) and cast the action
  // once below.
  type KnobParams = {
    min: number;
    max: number;
    step: number;
    valueStore: Writable<number>;
    inputElem: HTMLInputElement | undefined;
  };
  const drag = knobdrag as unknown as Action<HTMLDivElement, KnobParams>;

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

  // makeValueStore subscribes (and registers onDestroy) immediately, so it
  // must run during init, not inside $effect.
  const valueStore = makeValueStore(value, (newValue) =>
    (value = Math.floor(newValue + 0.5))
  );
  $effect(() => valueStore.set(value));
  let inputElem = $state<HTMLInputElement | undefined>();
  let knobParams = $derived({ min, max, step, valueStore, inputElem });
</script>

<div
  style:display="flex"
  style:flex-direction="column"
  style:align-items="center"
>
  <div class="background controlBG" use:drag={knobParams}>
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
