<script lang="ts">
  type Props = {
    onnoteup?: (key: number) => void;
    onnotedown?: (key: number) => void;
  };

  let { onnoteup, onnotedown }: Props = $props();

  let verbose = $state(false);
  // thanks to https://github.com/oscarhermoso/svelte-piano for his code

  function listInputsAndOutputs(midiAccess: MIDIAccess) {
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
  function onMIDIMessage(event: MIDIMessageEvent) {
    // the spec allows a message with no data (e.g. a closed port flushing)
    const data = event.data;
    if (!data) return;

    if (verbose) {
      let str =
        "MIDI message received at timestamp " +
        event.timeStamp +
        "[" +
        data.length +
        " bytes]: ";
      for (let i = 0; i < data.length; i++) {
        str += "0x" + data[i].toString(16) + " ";
      }
      console.log(str);
    }
    const command = data[0];
    const key = data[1];
    const velocity = data.length > 2 ? data[2] : 0; // a velocity value might not be included with a noteOff command
    switch (command) {
      case 144: // noteOn
        if (velocity > 0) {
          onnotedown?.(key);
        } else {
          onnoteup?.(key);
        }
        break;
      case 128: // noteOff
        onnoteup?.(key);
        break;
    }
  }

  type MidiStatus = "stopped" | "running" | "failed";
  let status = $state<MidiStatus>("stopped");

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
  <button
    onclick={midiButton}
    class="midiButton"
    disabled={status != "stopped"}
  >
    {#if status == "stopped"}
      Start MIDI
    {:else if status == "running"}
      MIDI Live
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
