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
    <a href="https://github.com/bismuthsoft/fazeoid"
       title="Fazeoid"
       style:height="2em"
       style:margin=".25em .25em">
        <img alt="Fazeoid" src="/fazeoid.svg" height="100%" />
    </a>
    <input
        title="Instrument Name"
        bind:value="{params.title}"
        type="text" />
    <button
        title="Randomize"
        on:click="{randomize}">
        <Cycle />
    </button>
    <button
        title="Save Instrument"
        on:click="{downloadInstrument}">
        <DocumentDownload />
    </button>
    <button
        title="Load Instrument"
        on:click="{uploadInstrument}">
        <DocumentUpload />
    </button>
    <a href="https://github.com/bismuthsoft/fazeoid#readme">
        <button
            title="Help"
            class="helpbutton">
            <Help />
        </button>
    </a>
</div>

<style>
 .titlebar {
     padding: inherit;
     display: flex;
     gap: 0.3em;
 }
 .titlebar input {
     font-size: 1.5em;
     padding: 0 .5em;
     margin-right: 0.5em;
     flex-grow: 1;
 }
 .helpbutton {
     height: 100%;
     background: #0088dd7f;
 }
 .helpbutton:hover {
     background: #0088ddff;
 }
</style>
