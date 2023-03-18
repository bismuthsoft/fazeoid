<script lang="ts">
  import IntegerPicker from "./IntegerPicker.svelte";
  export let portrait = false;
  export let numerator = 1;
  export let denominator = 1;

  let numParams = {
    min: 0,
    max: 12,
  };
  let denomParams = {
    min: 1,
    max: 12,
  };
</script>

<div class="fractionPicker" class:portrait>
  {#if portrait}
    <IntegerPicker {...numParams} bind:value={numerator} />
    /
    <IntegerPicker {...denomParams} bind:value={denominator} />
  {:else}
    <div class="landscapeNumerator">
      <IntegerPicker {...numParams} bind:value={numerator} />
    </div>
    <hr />
    <div class="landscapeDenominator">
      <IntegerPicker {...denomParams} bind:value={denominator} />
    </div>
  {/if}
</div>

<style>
  .landscapeNumerator {
    transform: translate(-0.5em, 0em);
  }
  .landscapeDenominator {
    transform: translate(0.5em, 0em);
  }
  .fractionPicker {
    font-size: 1.5rem;
    display: flex;
    flex-flow: column;
    align-items: center;
    gap: 0;
  }

  .fractionPicker.portrait {
    font-size: 1.75rem;
    flex-flow: row;
    gap: 0.4em;
  }

  hr {
    width: 2em;
    border: 1px solid white;
    margin: 0.2em;
    transform: rotate(-10deg);
  }
</style>
