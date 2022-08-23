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
    <footer>© Bismuthsoft 2022</footer>
</div>

<style>
 .container {
     display: grid;
     grid-gap: 1rem;
     place-items: center;
     height: 100vh;
     width: 100vw;
     color: white;
 }
 footer {
     background: #0000007f;
     padding: 0.5rem;
     border-radius: 0.5rem;
 }
 :global(body) {
     background: center/cover url(/background.jpg);
     background-attachment: fixed;
 }
</style>
