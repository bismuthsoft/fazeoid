<script lang="ts">
  import type { Snippet } from "svelte";

  let { expanded, children }: { expanded: boolean; children?: Snippet } =
    $props();
</script>

<div class="modal" style:visibility={expanded ? "visible" : "hidden"}>
  {@render children?.()}
</div>

<style>
  .modal {
    background-color: #888888af;
    backdrop-filter: blur(5px);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5em;
    border-radius: 1em;
    transition: 0.3s;
  }
</style>
