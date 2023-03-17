import VERSION from "../version";
import type { EnvelopeParams } from "./envelope";
import defaultInstrumentData from "./instruments/Synth Bass.json";

export const MIN_VOLUME = -72; // Volume at which things will be zeroed

export type Instrument = {
  version: typeof VERSION;
  title: string; // Name of instrument
  basePitch: number; // Base pitch in Hz
  oscs: OscillatorParams[]; // Oscillator config
};

export type OscillatorParams = {
  envelope: EnvelopeParams; // Volume envelope
  wave: WaveType;
  modulation: number[] /* How much to modulate phase from previous oscillators.
                             Expected value 0 to 10. Real modulation is 2^x.
                             */;
  pitchRatio: number; // Ratio of pitch from the base pitch.
  volume: number; // Volume in decibels
};

export type WaveType =
  | "sine"
  | "halfSine"
  | "absSine"
  | "quarterSine"
  | "pulseSine"
  | "square";

export type Note = {
  note: number; // Frequency
  instrumentIndex: number;
  uid: number;
};

export function sineWave(numOscs = 4): Instrument {
  return {
    title: "Sine Wave",
    version: VERSION,
    basePitch: 440,
    oscs: Array(numOscs)
      .fill(0)
      .map((_, i) => ({
        modulation: Array(i).fill(0),
        wave: "sine",
        pitchRatio: 1,
        envelope: {
          tag: "adsr",
          attack: 0.125,
          decay: 0.2,
          sustain: 0.5,
          release: 0.2,
        },
        volume: i === numOscs - 1 ? -12 : MIN_VOLUME,
      })),
  };
}

export function defaultInstrument(): Instrument {
  return defaultInstrumentData;
}

export function randomizeInstrument(params: Instrument): Instrument {
  const waves: WaveType[] = [
    "sine",
    "halfSine",
    "absSine",
    "quarterSine",
    "pulseSine",
    "square",
  ];
  const ratio = () =>
    Math.floor(Math.random() * 10) / Math.ceil(Math.random() * 11);
  return {
    ...params,
    oscs: Array(params.oscs.length)
      .fill(0)
      .map((_, i) => ({
        ...params.oscs[i],
        wave: waves[Math.floor(Math.random() * 6)],
        modulation: Array(i)
          .fill(0)
          .map(() => Math.pow(Math.random(), params.oscs.length - 1) * 100),
        pitchRatio: i === params.oscs.length - 1 ? 1 : ratio(),
      })),
  };
}
