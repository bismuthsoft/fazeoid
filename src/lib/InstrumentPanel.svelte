<script lang="ts">
 import { createEventDispatcher } from "svelte";
 import Knob from "$lib/Knob";
 import Piano from "$lib/piano/Piano.svelte";
 import { type Instrument, randomizeInstrument } from "$lib/audio/instrument";
 import { migrateInstrument } from "$lib/audio/migration";
 import OscilloscopePanel from "$lib/OscilloscopePanel.svelte";
 import EnvelopeEditor from "$lib/EnvelopeEditor.svelte";
 import EnvelopeViewer from "./EnvelopeViewer.svelte";
 import Cycle from "svelte-grommet-icons/lib/Cycle.svelte";
 import DocumentDownload from "svelte-grommet-icons/lib/DocumentDownload.svelte";
 import DocumentUpload from "svelte-grommet-icons/lib/DocumentUpload.svelte";

 export let params: Instrument;
 export let portrait = true;
 let filename = 'Instrument';
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
         filename = files[0].name.match(/(.*)\.json/)[1];
         const instrumentData = JSON.parse(await files[0].text());
         params = migrateInstrument(instrumentData);
     });
     // TODO investigate: do we need to remove the event listener?
 }

 const dispatch = createEventDispatcher();
 function noteDown(ev: CustomEvent) { dispatch('noteDown', ev.detail); }
 function noteUp(ev: CustomEvent) { dispatch('noteUp', ev.detail); }

 const knobProps = {
     size: '6rem',
 };
</script>

<div class="InstrumentPanel">

    <div class="titlebar">
        <input name="filename" type="text" bind:value="{filename}" />
        <button on:click="{randomize}"><div><Cycle /></div></button>
        <button on:click="{downloadInstrument}"><DocumentDownload /></button>
        <button on:click="{uploadInstrument}"><DocumentUpload /></button>
    </div>

    <section>
        <heading />
        {#each params.oscs as osc, oscIndex}
            <div class="rowLabel">{oscIndex}</div>
        {/each}
    </section>

    <section>
        <heading> ADSR Envelope </heading>
        <div class="group">
            <div class="box">
                {#each params.oscs as osc}
                    <EnvelopeEditor bind:envelope="{osc.envelope}"/>
                {/each}
            </div>
            <div class="box">
                {#each params.oscs as osc}
                    <EnvelopeViewer envelope="{osc.envelope}"/>
                {/each}
            </div>
        </div>
    </section>

    <section>
        <heading> Pitch ratio </heading>
        <div class="box">
            {#each params.oscs as osc, oscIndex}
                <Knob bind:value="{params.oscs[oscIndex].pitchRatio}"
                      min="{0}" max="{10}"
                      pointerColor="#fb6060"
                      {...knobProps}
                />
            {/each}
        </div>
    </section>

    <section>
        <heading> Modulation </heading>
        <div class="box">

        </div>
    </section>

    <section>
        <heading> Volume </heading>
        {#each params.oscs as osc, oscIndex}
            <Knob bind:value="{params.oscs[oscIndex].volume}"
                  min="{-72}" max="{0}"
                  pointerColor="#fff"
                  {...knobProps}
            />
        {/each}
    </section>

    <section style:flex-wrap="wrap">
        <OscilloscopePanel instrument="{params}" />
    </section>

    <Piano on:noteUp="{noteUp}" on:noteDown="{noteDown}"/>
</div>

<style>
 .InstrumentPanel {
     display: flex;
     flex-direction: column;
     gap: .5rem;
     border: solid #333 0.2rem;
     margin: 1rem 0;
     border-radius: .5em;
     background: var(--bg-color);
     --bg-color: #20b070;
 }
 section heading {
     writing-mode: vertical-lr;
     transform: rotate(180deg);
}
 section {
     display: flex;
     flex-direction: row;
     gap: .5rem;
     justify-content: space-between;
 }
 section .group {
     display: flex;
     flex-direction: column;
 }
 section .box {
     display: flex;
     flex-direction: row;
     justify-content: space-around;
 }
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
 heading {
     font-weight: bold;
 }
 .rowLabel {
     text-align: center;
     align-self: center;
     font-size: 3rem;
     font-weight: bold;
 }
 .modulationCell {
     margin: 0.5rem;
 }
 .knobRegion {
     background: #ffffff7f;
     border-radius: 2rem;
 }
 heading {
     display: block;
     text-align: center;
 }
</style>
