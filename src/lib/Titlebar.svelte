<script lang="ts">
 import { randomizeInstrument, type Instrument } from "./audio/instrument";
 import { migrateInstrument } from "./audio/migration";
 import Cycle from "svelte-grommet-icons/lib/Cycle.svelte";
 import DocumentDownload from "svelte-grommet-icons/lib/DocumentDownload.svelte";
 import DocumentUpload from "svelte-grommet-icons/lib/DocumentUpload.svelte";

 export let params: Instrument;
 let filename = 'Instrument';

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
     download(`${filename}.json`, 'application/json', JSON.stringify(params, null, 2));
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
         filename = match ? match[1] : files[0].name;
         const instrumentData = JSON.parse(await files[0].text());
         params = migrateInstrument(instrumentData);
     });
     // TODO investigate: do we need to remove the event listener?
 }
</script>

<div class="titlebar">
    <img alt="Fazeoid" src="/fazeoid.svg"
         style:height="2rem" style:margin=".25rem .5rem" />
    <input name="filename" type="text" bind:value="{filename}" />
    <button on:click="{randomize}"><div><Cycle /></div></button>
    <button on:click="{downloadInstrument}"><DocumentDownload /></button>
    <button on:click="{uploadInstrument}"><DocumentUpload /></button>
</div>

<style>
 .titlebar {
     border-bottom: solid #333 0.2rem;
     padding: .5rem;
     display: flex;
 }
 .titlebar input {
     font-size: 1.5em;
     padding: 0 .5em;
     margin-right: 0.5em;
     flex-grow: 1;
 }
</style>
