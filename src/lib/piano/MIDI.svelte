<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let verbose = false;
  // thanks to https://github.com/oscarhermoso/svelte-piano for his code

  function listInputsAndOutputs(midiAccess: WebMidi.MIDIAccess) {
    for (const entry of midiAccess.inputs) {
      const input = entry[1];
      console.log(
        "Input port [type:'" +
          input.type +
          "'] id:'" +
          input.id +
          "' manufacturer:'" +
          input.manufacturer +
          "' name:'" +
          input.name +
          "' version:'" +
          input.version +
          "'"
      );
    }
    for (const entry of midiAccess.outputs) {
      const output = entry[1];
      console.log(
        "Output port [type:'" +
          output.type +
          "'] id:'" +
          output.id +
          "' manufacturer:'" +
          output.manufacturer +
          "' name:'" +
          output.name +
          "' version:'" +
          output.version +
          "'"
      );
    }
  }
  function onMIDIMessage(event: WebMidi.MIDIMessageEvent) {
    if (verbose) {
      let str =
        "MIDI message received at timestamp " +
        event.timeStamp +
        "[" +
        event.data.length +
        " bytes]: ";
      for (let i = 0; i < event.data.length; i++) {
        str += "0x" + event.data[i].toString(16) + " ";
        event.data;
      }
      console.log(str);
    }
    const command = event.data[0];
    const key = event.data[1];
    const velocity = event.data.length > 2 ? event.data[2] : 0; // a velocity value might not be included with a noteOff command
    switch (command) {
      case 144: // noteOn
        if (velocity > 0) {
          dispatch("noteDown", key);
        } else {
          dispatch("noteUp", key);
        }
        break;
      case 128: // noteOff
        dispatch("noteUp", key);
        break;
    }
  }

  type MidiStatus = "stopped" | "running" | "failed";
  let status: MidiStatus = "stopped";

  function midiButton() {
    if (status == "stopped") {
      startMidi();
    }
  }

  async function startMidi() {
    try {
      let midiAccess = await navigator.requestMIDIAccess();
      if (verbose) listInputsAndOutputs(midiAccess);
      midiAccess.inputs.forEach((entry) => {
        entry.onmidimessage = onMIDIMessage;
      });
      status = "running";
    } catch (err) {
      status = "failed";
      console.log("Failed to get MIDI access - " + err);
    }
  }
</script>

<div>
  <button on:click={midiButton} class="midiButton">
    {#if status == "stopped"}
      Start MIDI
    {:else if status == "running"}
      MIDI is Live
    {:else if status == "failed"}
      MIDI Failed!
    {/if}
  </button>
</div>

<style>
  .midiButton {
    width: 100%;
  }
</style>
