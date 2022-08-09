<script lang="ts">
 import { createEventDispatcher } from "svelte";
 import Knob from "@bismuthsoft/svelte-dj-knob";
 import Piano from "$lib/piano/Piano.svelte";
 import { type Instrument, randomizeInstrument } from "$lib/soundgen/instrument";
 import OscilloscopePanel from "$lib/OscilloscopePanel.svelte";
 import EnvelopeEditor from "$lib/EnvelopeEditor.svelte";
 import EnvelopeViewer from "./EnvelopeViewer.svelte";
 import Cycle from "svelte-grommet-icons/lib/Cycle.svelte";
 import DocumentDownload from "svelte-grommet-icons/lib/DocumentDownload.svelte";
 import DocumentUpload from "svelte-grommet-icons/lib/DocumentUpload.svelte";

 export let params: Instrument;
 let numOscs = params.oscs.length;

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
     download('instrument.json', 'application/json', JSON.stringify(params, null, 2));
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
         params = JSON.parse(await files[0].text());
     });
     // TODO investigate: do we need to remove the event listener?
 }

 const dispatch = createEventDispatcher();
 function noteDown(ev: CustomEvent) { dispatch('noteDown', ev.detail); }
 function noteUp(ev: CustomEvent) { dispatch('noteUp', ev.detail); }

 const envelopesX = 2; // Grid X position of volumes
 const ratioX = 3; // grid X position of pitch ratios
 const modX = 4; // grid X position of modulation matrix
 const scopeX = modX + numOscs - 1;
 const totalWidth = scopeX;

 const headerY = 1;
 const oscsY = headerY + 1;
 const pianoY = oscsY + numOscs;

 const knobProps = {
     size: '5rem',
     fgColor: '#8D8',
     bgColor: '#333'
 };
</script>

<div id="knobGrid">
    <heading style:grid-area="1/{envelopesX}"> ADSR </heading>
    <heading style:grid-area="1/{ratioX}"> Pitch ratio </heading>
    <heading style:grid-area="1/{modX}/1/{modX+numOscs-1}"> Modulation </heading>
    <heading style:grid-area="1/{scopeX}"> Scope </heading>

    <OscilloscopePanel instrument="{params}" gridArea="{{x: scopeX, y: 2}}"/>
    <div class="knobRegion" style:grid-area="2/{modX}/{2+numOscs}/{modX+numOscs-1}"></div>

    {#each params.oscs as osc, oscIndex}
        <div class="envelopeCell" style:grid-area="{oscIndex+2}/{envelopesX}">
            <EnvelopeEditor bind:envelope="{osc.envelope}"/>
            <EnvelopeViewer envelope="{osc.envelope}"/>
        </div>
        <div class="rowLabel" style:grid-area="{oscIndex+2}/1">{oscIndex}</div>
        <div class="knobCell" style:grid-area="{oscIndex+2}/{ratioX}">
            <Knob bind:value="{params.oscs[oscIndex].pitchRatio}"
                  min="{0}" max="{10}"
                  {...knobProps}
            />
        </div>
        {#each osc.modulation as _, modIndex}
            <div class="knobCell" style:grid-area="{2+oscIndex}/{modX+modIndex}">
                <Knob bind:value="{params.oscs[oscIndex].modulation[modIndex]}"
                      min="{0}" max="{6}"
                      {...knobProps}
                />
                {`←${modIndex}`}
            </div>
        {/each}
    {/each}

    <div style:grid-area="{pianoY} / 1 / {pianoY} / {totalWidth+1}">
        <Piano on:noteUp="{noteUp}" on:noteDown="{noteDown}"/>
    </div>
</div>

<div>
    <button on:click="{randomize}"><div><Cycle /></div></button>
    <button on:click="{downloadInstrument}"><DocumentDownload /></button>
    <button on:click="{uploadInstrument}"><DocumentUpload /></button>
</div>


<style>
 #knobGrid {
     display: grid;
     border: solid #333 0.2rem;
     margin: 1rem;
     padding: 1rem;
     grid-gap: .5rem;

     grid-template-rows: 2rem;
     grid-auto-rows: 7rem;
 }
 heading {
     font-weight: bold;
 }
 .rowLabel {
     text-align: center;
     align-self: center;
     font-size: 24px;
 }
 .knobCell {
     justify-self: center;
     display: flex;
     flex-direction: column;
     align-items: center;
     margin:.5rem;
 }
 .envelopeCell {
     align-items: center;
     justify-self: center;
     display: flex;
     flex-direction: row;
 }
 .knobRegion {
     border: solid #333 0.2rem;
 }
 heading {
     display: block;
     text-align: center;
 }
</style>
