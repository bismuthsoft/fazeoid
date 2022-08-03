<script lang="ts">
 import Knob from "@bismuthsoft/svelte-dj-knob/MinimalKnob.svelte";
 import { randomizeInstrument } from "$lib/soundgen/instrument";
 import type { Instrument } from "$lib/soundgen/instrument";
 import OscilloscopePanel from "$lib/OscilloscopePanel.svelte";
 import EnvelopeEditor from "$lib/EnvelopeEditor.svelte";

 export let params: Instrument;
 let numOscs = params.oscs.length;

 function randomize () {
     params = randomizeInstrument(params);
 }

 const envelopesX = 2; // Grid X position of volumes
 const ratioX = 3; // grid X position of pitch ratios
 const modX = 4; // grid X position of modulation matrix
 const scopeX = modX + numOscs - 1;
 const knobProps = {
     size: '5rem',
     fgColor: '#8D8',
     bgColor: '#333'
 };
</script>

<div id="knobGrid">
    <button on:click="{randomize}">Randomize</button>

    <heading style:grid-area="1/{envelopesX}"> ADSR </heading>
    <heading style:grid-area="1/{ratioX}"> Pitch ratio </heading>
    <heading style:grid-area="1/{modX}/1/{modX+numOscs-1}"> Modulation </heading>
    <heading style:grid-area="1/{scopeX}"> Scope </heading>

    <div style:grid-area="2/{scopeX}/{2+numOscs}/{scopeX}">
        <OscilloscopePanel instrument="{params}"/>
    </div>
    <div class="knobRegion" style:grid-area="2/{modX}/{2+numOscs}/{modX+numOscs-1}"></div>

    {#each params.oscs as osc, oscIndex}
        <div class="knobCell" style:grid-area="{oscIndex+2}/{envelopesX}">
            <EnvelopeEditor bind:envelope="{params.oscs[oscIndex].envelope}"/>
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

</div>


<style>
 #knobGrid {
     display: grid;
     border: solid black 0.2rem;
     margin: 1rem;
     padding: 1rem;
     grid-gap: .5rem;
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
 .knobRegion {
     border: solid black 0.2rem;
 }
 heading {
     display: block;
     text-align: center;
 }
</style>
