import type { Instrument, OscillatorParams } from "./instrument";
import VERSION from "../version";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- JSON.parse boundary: untrusted instrument data
export function migrateInstrument(instrument: any): Instrument {
  switch (instrument.version) {
    case "0.0.1":
      instrument.oscs = instrument.oscs.map((osc: OscillatorParams) => ({
        ...osc,
        envelope:
          osc.envelope.tag !== "adsr"
            ? osc.envelope
            : {
              ...osc.envelope,
              attack: 1 / osc.envelope.attack,
              decay: (1 - osc.envelope.sustain) / osc.envelope.decay,
              release: 1 / osc.envelope.release,
            },
      }));
      // fall through
    case "0.0.2":
      instrument.title = instrument.title ?? "Instrument";
      // fall through
    case "0.0.3":
      instrument.oscs = instrument.oscs.map((osc: OscillatorParams) => ({
        ...osc,
        wave: "sine",
      }));
      // fall through
    case "0.2.0":
    // No change
    // fall through
    case "0.3.0": {
      function estimateFraction(n: number): [number, number] {
        let best = [1, 1, Infinity];
        for (let i = 1; i < 12; ++i) {
          const guess = [Math.round(i * n), i];
          const error = Math.abs(n - guess[0] / guess[1]);
          if (guess[0] <= 12 && best[2] - error > 0.01) {
            best = guess.concat(error);
          }
        }
        if (best[2] > 0.01) {
          console.log('Instrument migration warning: pitch ratio is not a simple fraction: ' + n);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- slice() widens tuple to number[]
        return best.slice(0, 2) as any;
      }
      instrument.oscs = instrument.oscs.map((osc: OscillatorParams & { pitchRatio: number }) => ({
        ...osc,
        pitchFraction: estimateFraction(osc.pitchRatio),
        pitchRatio: undefined,
      }));
    }
    // fall through
    case "0.4.0":
      instrument.oscs = instrument.oscs.map((osc: OscillatorParams) => ({
        ...osc,
        wave: (osc.wave as string) === 'quarterSine' ? 'saw' : osc.wave,
      }));
      instrument.version = "0.5.0";
      // fall through
    case "0.5.0":
      break;
    default:
      throw new Error("UNRECOGNIZED VERSION: " + instrument.version);
  }
  if (instrument.version !== VERSION) {
    throw new Error("Migration has failed to set correct instrument version.");
  }
  return instrument;
}
