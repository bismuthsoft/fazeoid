<script lang="ts">
  import type { Note } from "$lib/audio/instrument";
  import keyBinds from "./keyBinds";
  import noteNames from "./noteNames";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let keyLabel: "none" | "note" | "noteOctave" = "none";
  export let portrait: boolean;

  type PianoKey = {
    isWhite: boolean;
    row: number;
    column: number;
    note: number;
  };

  const MIN_OCTAVE = 2;
  const MAX_OCTAVE = 6;
  let octave = 5;
  $: numKeys = portrait ? 18 : 36;
  let keys: PianoKey[];
  let noteOffset: number;
  $: {
    // Octave shift
    noteOffset = (octave - Math.floor(numKeys / 24)) * 12;
    keys = generateKeys(numKeys);
    clearNotes();
  }

  function generateKeys(numKeys: number): PianoKey[] {
    return Array(numKeys)
      .fill(0)
      .map((_, index: number) => {
        const note = index;
        const isWhite = isWhiteNote(note);
        const row = isWhite ? 2 : 1;
        const column = collapseColumn(note);
        return { isWhite, row, column, note };
      });
  }

  type PianoNote = { keyboard?: Note; pointer?: Note };
  let notesDown: PianoNote[] = [];
  let noteuid = 0;

  function pressNote(note: number, type: keyof PianoNote): Note | undefined {
    if (notesDown[note] && notesDown[note][type]) {
      return undefined;
    }
    const pressed: Note = {
      note: note + noteOffset,
      uid: noteuid++,
      instrumentIndex: 0,
    };
    notesDown[note] = {
      ...(notesDown[note] ?? {}),
      [type]: pressed,
    };
    dispatch("noteDown", pressed);
    return pressed;
  }
  function releaseNote(note: number, type: keyof PianoNote) {
    const noteObj = notesDown[note] && notesDown[note][type];
    if (noteObj) {
      dispatch("noteUp", noteObj.uid);
      notesDown[noteObj.note - noteOffset][type] = undefined;
    } else {
      console.log("Bad " + type + " note up " + note);
    }
  }
  function clearNotes() {
    notesDown.forEach((note) => {
      if (note.keyboard) dispatch("noteUp", note.keyboard.uid);
      if (note.pointer) dispatch("noteUp", note.pointer.uid);
    });
    notesDown = [];
  }

  function isWhiteNote(index: number): boolean {
    return [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1][index % 12] === 1;
  }
  function collapseColumn(index: number): number {
    const octave = Math.floor(index / 12) * 7;
    return [1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 7][index % 12] + octave;
  }
  function keyLabelFn(note: number): string {
    return (
      noteNames[note % 12] +
      (keyLabel === "noteOctave" ? octave + Math.floor(note / 12) : "")
    );
  }

  function keyboardDown(ev: KeyboardEvent) {
    return handleKeyboard(ev, true);
  }
  function keyboardUp(ev: KeyboardEvent) {
    return handleKeyboard(ev, false);
  }

  function handleKeyboard(ev: KeyboardEvent, down: boolean) {
    if (
      (down && (ev.altKey || ev.ctrlKey || ev.shiftKey)) ||
      document.activeElement instanceof HTMLInputElement
    ) {
      return undefined;
    }
    const note = keyBinds[ev.code];
    if (note !== undefined) {
      ev.preventDefault();
      if (ev.repeat) return;
      if (down) {
        pressNote(note, "keyboard");
      } else {
        releaseNote(note, "keyboard");
      }
    }
  }
</script>

<svelte:window on:keydown={keyboardDown} on:keyup={keyboardUp} />

<div class="pianoBar">
  <button
    class="octaveButton"
    on:click={() => (octave = Math.max(MIN_OCTAVE, octave - 1))}
  >
    -
  </button>
  Octave: {octave}
  <button
    class="octaveButton"
    on:click={() => (octave = Math.min(MAX_OCTAVE, octave + 1))}
  >
    +
  </button>
</div>

<div class="piano">
  {#each keys as { isWhite, row, column, note } (note)}
    <div
      style:grid-area="{row} / {column}"
      class:whiteKey={isWhite}
      class:blackKey={!isWhite}
      class:oddOctave={(note + noteOffset) % 24 < 12}
      class:down={notesDown[note]?.keyboard || notesDown[note]?.pointer}
      on:pointerdown={() => pressNote(note, "pointer")}
      on:pointerup={() => releaseNote(note, "pointer")}
      on:mouseenter={(ev) => {
        if (ev.buttons > 0) pressNote(note, "pointer");
      }}
      on:mouseleave={() => releaseNote(note, "pointer")}
    >
      {#if keyLabel !== "none"}
        <div class="keyLabel">
          {keyLabelFn(note)}
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .pianoBar {
    align-self: center;
  }
  .octaveButton {
    font-size: 1rem;
    width: 40px;
  }
  .piano {
    display: grid;
    width: 100%;
    height: 9rem;
    padding: 0.5rem;
    box-sizing: border-box;
    grid-template-rows: 1fr 1fr;
    grid-auto-flow: none;
    touch-action: none;
    opacity: 0.6;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  .whiteKey {
    display: grid;
    place-items: center;
    user-select: none;
    transform: translate(0%, -40%);
    height: 170%;
    background: white;
    outline: 1px solid white;
    border-radius: 1em;
  }
  /* Octave coloring: */
  .whiteKey.oddOctave {
    outline: 1px solid #ddd;
    background: #ddd;
  }
  .whiteKey.down {
    background: var(--highlight-opaque);
  }
  .blackKey {
    display: grid;
    place-items: center;
    user-select: none;
    transform: translate(50%, 0%);
    height: 115%;
    z-index: 1;
    outline: 1px solid #222;
    border-radius: 1em;
    background: #222;
  }
  .blackKey.down {
    background: var(--highlight-opaque);
  }

  .keyLabel {
    position: absolute;
    justify-self: center;
    z-index: 2;
    user-select: none;
    font-weight: bold;
  }
  .whiteKey .keyLabel {
    margin-top: 2em;
    align-self: middle;
    color: #333;
  }
  .blackKey .keyLabel {
    align-self: end;
    margin-bottom: 8px;
    color: white;
  }
</style>
