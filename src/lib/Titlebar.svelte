<script lang="ts">
 import { randomizeInstrument, type Instrument } from "./audio/instrument";
 import { migrateInstrument } from "./audio/migration";
 import Cycle from "svelte-grommet-icons/lib/Cycle.svelte";
 import DocumentDownload from "svelte-grommet-icons/lib/DocumentDownload.svelte";
 import DocumentUpload from "svelte-grommet-icons/lib/DocumentUpload.svelte";
 import Help from "svelte-grommet-icons/lib/Help.svelte";

 export let params: Instrument;

 function randomize () {
     params = randomizeInstrument(params);
 }
 function download(filename: string, type: string, data: string) {
     const a = document.createElement('a');
     a.href = window.URL.createObjectURL(
         new Blob([data], {type})
     );
     a.download = filename;
     a.style.display = 'none';
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
 }
 function downloadInstrument() {
     download(`${params.title}.json`, 'application/json', JSON.stringify(params, null, 2));
 }
 function uploadInstrument() {
     const input = document.createElement('input');
     input.type = 'file';
     input.accept = '.json';
     input.style.display = 'none';
     document.body.appendChild(input);
     input.click();
     document.body.removeChild(input);
     input.addEventListener('change', async e => {
         const files = (e.currentTarget as HTMLInputElement).files || [];
         const match = files[0].name.match(/(.*)\.json/);
         const filename = match ? match[1] : files[0].name;
         const instrumentData = JSON.parse(await files[0].text());
         // Migrate instruments to 0.0.3 onwards
         if (!instrumentData.title) instrumentData.title = filename;
         params = migrateInstrument(instrumentData);
     });
     // TODO investigate: do we need to remove the event listener?
 }
</script>

<div class="titlebar">
    <img alt="Fazeoid" src="/fazeoid.svg"
         style:height="2rem" style:margin=".25rem .5rem" />
    <input name="filename" type="text" bind:value="{params.title}" />
    <button on:click="{randomize}"><div><Cycle /></div></button>
    <button on:click="{downloadInstrument}"><DocumentDownload /></button>
    <button on:click="{uploadInstrument}"><DocumentUpload /></button>
    <a href="https://github.com/bismuthsoft/fazeoid#readme">
        <button style:height="100%" style:background="#0088dd7f"><Help /></button></a>
</div>

<style>
 .titlebar {
     border-bottom: inherit;
     padding: inherit;
     display: flex;
     gap: 0.3rem;
 }
 .titlebar input {
     font-size: 1.5em;
     padding: 0 .5em;
     margin-right: 0.5em;
     flex-grow: 1;
 }
</style>
