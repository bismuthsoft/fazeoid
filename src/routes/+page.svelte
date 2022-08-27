<script>
 import App from "$lib/App.svelte";
 import background480 from  "$lib/assets/background.jpg?w=480&h=1080";
 import background960 from  "$lib/assets/background.jpg?w=960&h=1080";
 import background1920 from  "$lib/assets/background.jpg";
 const backgrounds = [
     [480,  background480],
     [960,  background960],
     [1920, background1920],
 ];
 const backgroundSrcs = backgrounds
     .map(([width, url]) => `${url} ${width}w`)
     .join(', ');
 const backgroundSizes = [
     ...backgrounds.slice(0, -1).map(([w]) => `(max-width: ${w}px) ${w}px`),
     `${backgrounds[backgrounds.length -1][0]}px`,
 ].join(', ');
</script>

<svelte:head>
    <title>
        Fazeoid
    </title>
</svelte:head>

<div class="container">
    <App />
</div>
<div class="background">
    <img
        alt="background"
        srcset="{backgroundSrcs}"
        sizes="{backgroundSizes}"
    />
</div>

<style>
 .container {
     position: absolute;
     inset: 0;
     display: grid;
     place-items: center;
 }
 .background {
     position: fixed;
     inset: 0;
     z-index: -1;
 }
 .background img {
     object-fit: cover;
     object-position: center;
     width: 100%;
     height: 100%;
 }
</style>
