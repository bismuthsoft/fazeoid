<script>
 import App from "$lib/App.svelte";
</script>

<svelte:head>
    <title>
        Fazeoid
    </title>
</svelte:head>

<div class="container">
    <App />
</div>

<style>
 .container {
     display: grid;
     grid-gap: 1rem;
     place-items: center;
     height: 100vh;
     width: 100vw;
 }
 :global(body) {
     background: center/cover url(/background.jpg);
     background-attachment: fixed;
 }
</style>
