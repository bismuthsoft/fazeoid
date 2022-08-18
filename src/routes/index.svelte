<script>
 import App from "$lib/App.svelte";
</script>

<svelte:head>
    <title>
        FMSite
    </title>
</svelte:head>

<div class="container">
    <App />
</div>

<style>
 .container {
     display: grid;
     place-items: center;
     height: 100vh;
     width: 100vw;
 }
 :global(body) {
     background: center/cover url(https://static.miraheze.org/windowswallpaperwiki/d/dc/Cook_Island.jpg);
 }
</style>
