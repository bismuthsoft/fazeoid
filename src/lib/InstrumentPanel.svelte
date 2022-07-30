<script lang="ts">
 import Knob from "@bismuthsoft/svelte-dj-knob/Knob.svelte";
 import { defaultInstrument, randomizeInstrument } from "$lib/soundgen/instrument"
 import OscilloscopePanel from "$lib/OscilloscopePanel.svelte"

 export let params = defaultInstrument(4);
 let numOscs = params.oscs.length;

 function randomize () {
     params = randomizeInstrument(params);
 }

 const volumeX = 2; // Grid X position of volumes
 const ratioX = 3; // grid X position of pitch ratios
 const modX = 4; // grid X position of modulation matrix
 const scopeX = modX + numOscs - 1;
 const knobSize = '5rem';
</script>

<div id="knobGrid">
    <button on:click="{randomize}">Randomize</button>

    <heading style:grid-area="1/{volumeX}"> Volume </heading>
    <heading style:grid-area="1/{ratioX}"> Pitch ratio </heading>
    <heading style:grid-area="1/{modX}/1/{modX+numOscs-1}"> Modulation </heading>
    <heading style:grid-area="1/{scopeX}"> Scope </heading>

    <div class="knobCell" style:grid-area="{numOscs+1}/2">
        <Knob bind:value="{params.volume}" label="" min="{-72}" max="{0}" size="{knobSize}"/>
    </div>

    <div style:grid-area="2/{scopeX}/{2+numOscs}/{scopeX}">
        <OscilloscopePanel instrument="{params}"/>
    </div>
    <div class="knobRegion" style:grid-area="2/{modX}/{2+numOscs}/{modX+numOscs-1}"></div>

    {#each params.oscs as osc, oscIndex}
        <div class="rowLabel" style:grid-area="{oscIndex+2}/1">{oscIndex}</div>
        <div class="knobCell" style:grid-area="{oscIndex+2}/{ratioX}">
            <Knob bind:value="{params.oscs[oscIndex].pitchRatio}"
                  label=""
                  min="{0}" max="{10}"
                  size="{knobSize}"
            />
        </div>
        {#each osc.modulation as _, modIndex}
            <div class="knobCell" style:grid-area="{2+oscIndex}/{modX+modIndex}">
                <Knob bind:value="{params.oscs[oscIndex].modulation[modIndex]}"
                      label="{`←${modIndex}`}"
                      min="{0}" max="{6}"
                      size="{knobSize}"
                />
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
 }
 .knobRegion {
     border: solid black 0.2rem;
 }
 heading {
     display: block;
     text-align: center;
 }
</style>
