<script lang="ts">
 import type { Instrument } from "$lib/audio/instrument";
 import EnvelopeEditor from "$lib/EnvelopeEditor.svelte";
 import EnvelopeViewer from "$lib/EnvelopeViewer.svelte";
 import Knob from "$lib/Knob";
 import ModulationPanel from "./ModulationPanel.svelte";
 import OscilloscopePanel from "$lib/OscilloscopePanel.svelte";

 export let params: Instrument;
 export let portrait = true;

 const knobProps = {
     size: '6rem',
 };
</script>

<div class="InstrumentPanel"
     class:landscape="{!portrait}">

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

</div>

<style>
 .InstrumentPanel {
     display: flex;
     flex-direction: column;
     gap: .5rem;
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
 .InstrumentPanel.landscape {
     flex-direction: row;
 }
 .InstrumentPanel.landscape section .group {
     flex-direction: row;
 }
 .InstrumentPanel.landscape section .box {
     flex-direction: column;
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
 heading {
     display: block;
     text-align: center;
 }
</style>
