<script lang="ts">
 import { createEventDispatcher } from "svelte";
 import { type Instrument, randomizeInstrument } from "$lib/audio/instrument";
 import { migrateInstrument } from "$lib/audio/migration";

 // Components
 import EnvelopeEditor from "$lib/EnvelopeEditor.svelte";
 import EnvelopeViewer from "$lib/EnvelopeViewer.svelte";
 import Knob from "$lib/Knob";
 import ModulationPanel from "./ModulationPanel.svelte";
 import OscilloscopePanel from "$lib/OscilloscopePanel.svelte";
 import Piano from "$lib/piano/Piano.svelte";

 // Icons
 import Cycle from "svelte-grommet-icons/lib/Cycle.svelte";
 import DocumentDownload from "svelte-grommet-icons/lib/DocumentDownload.svelte";
 import DocumentUpload from "svelte-grommet-icons/lib/DocumentUpload.svelte";

 export let params: Instrument;
 export let portrait = true;
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

<div class="InstrumentPanel"
     class:landscape="{!portrait}">

    <div class="titlebar">
        <input name="filename" type="text" bind:value="{filename}" />
        <button on:click="{randomize}"><div><Cycle /></div></button>
        <button on:click="{downloadInstrument}"><DocumentDownload /></button>
        <button on:click="{uploadInstrument}"><DocumentUpload /></button>
    </div>

    <section>
        <heading />
        <div class="box">
            {#each params.oscs as osc, oscIndex}
                <div class="rowLabel">{oscIndex}</div>
            {/each}
        </div>
    </section>

    <section>
        <heading> ADSR Envelope </heading>
            <div class="box">
                {#each params.oscs as osc}
                    <div class="group">
                        <EnvelopeEditor bind:envelope="{osc.envelope}"/>
                        <EnvelopeViewer envelope="{osc.envelope}"/>
                    </div>
                {/each}
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
            <ModulationPanel bind:params {knobProps} {portrait} />
        </div>
    </section>

    <section>
        <heading> Volume </heading>
        <div class="box">
            {#each params.oscs as osc, oscIndex}
                <Knob bind:value="{params.oscs[oscIndex].volume}"
                      min="{-72}" max="{0}"
                      pointerColor="#fff"
                      {...knobProps}
                />
            {/each}
        </div>
    </section>

    <section>
        <heading> Scope </heading>
        <div class="box" style:flex-wrap="wrap">
            <OscilloscopePanel instrument="{params}" {portrait} />
        </div>
    </section>

    <Piano on:noteUp="{noteUp}" on:noteDown="{noteDown}"/>
</div>

<style>
 .InstrumentPanel {
     display: flex;
     flex-direction: column;
     gap: .5rem;
     border: solid #333 0.2rem;
     border-radius: .5em;
     background: var(--bg-color);
     --bg-color: #0000;
     backdrop-filter: brightness(0.5) contrast(0.8) hue-rotate(0.90turn) blur(5px);
     color: white;
     filter: drop-shadow(4px 4px 10px #3338);
 }
 .InstrumentPanel.landscape {
     flex-direction: row;
 }
 section heading {
     writing-mode: vertical-lr;
     transform: rotate(180deg);
}
 section {
     display: flex;
     flex-direction: row;
     justify-content: space-between;
 }
 section .group {
     display: flex;
     flex-direction: column;
     align-items:center;
     gap: .5rem;
 }
 section .box {
     display: flex;
     flex-direction: row;
     gap: .5rem;
     width: 100%;
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
     min-width: 1.8rem;
 }
 .rowLabel {
     text-align: center;
     align-self: center;
     font-size: 2rem;
     font-weight: bold;
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
