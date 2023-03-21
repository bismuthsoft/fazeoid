import VERSION from "../version";
import type { Note, Instrument } from "./instrument";
import Voice from "./Voice.js";

export class Mixer {
  srate = 48000;
  private voices: Voice[] = [];
  private instruments: Instrument[] = [];

  constructor() {}

  writeWave(channels: Float32Array[]) {
    channels.forEach((c) => c.fill(0));
    this.voices.forEach((voice) => voice.addWave(channels));

    // Deallocate stopped notes. Doesn't need to run often.
    this.voices = this.voices.filter((v) => !v.isStopped());
  }

  setSrate(srate: number) {
    this.srate = srate;
  }

  noteDown(note: Note) {
    const instrument = this.instruments[note.instrumentIndex];
    if (instrument) {
      this.voices.push(new Voice(instrument, note, this.srate));
    } else {
      console.log(`Cannot play note with uninitialized instrument: ${note}`);
    }
  }

  noteUp(note: Note) {
    const voice = this.voices.find(
      (v) =>
        v.note.note === note.note &&
        v.note.instrumentIndex === note.instrumentIndex
    );
    if (voice) {
      voice.gate = false;
    } else {
      console.log(`Bad note up ${note}`);
    }
  }

  clear() {
    this.voices = [];
    //    this.voices.forEach((v) => (v.gate = false));
  }

  setInstrument(index: number, instrument: Instrument) {
    if (instrument.version !== VERSION) {
      throw new Error(`Incompatible instrument version:
got: ${instrument.version}
expected: ${VERSION}`);
    }
    this.instruments[index] = instrument;
    this.voices.forEach((v) => {
      // Live update
      if (v.instrumentIndex === index) v.updateInstrument(instrument);
    });
  }
}
