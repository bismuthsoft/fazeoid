import type { Instrument, OscillatorParams } from "./instrument";
import VERSION from "../version";

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
    case "0.0.2":
      instrument.title = instrument.title ?? "Instrument";
    case "0.0.3":
      instrument.oscs = instrument.oscs.map((osc: OscillatorParams) => ({
        ...osc,
        wave: "sine",
      }));
    case "0.2.0":
    // No change
    case "0.3.0":
      function estimateFraction(n: number): [number, number] {
        let best = [1, 1, Infinity];
        for (let i = 1; i < 12; ++i) {
          let guess = [Math.round(i * n), i];
          let error = Math.abs(n - guess[0] / guess[1]);
          if (guess[0] <= 12 && best[2] - error > 0.01) {
            best = guess.concat(error);
          }
        }
        if (best[2] > 0.01) {
          console.log('Instrument migration warning: pitch ratio is not a simple fraction: ' + n);
        }
        return best.slice(0, 2) as any;
      }
      instrument.oscs = instrument.oscs.map((osc: OscillatorParams & { pitchRatio: number }) => ({
        ...osc,
        pitchFraction: estimateFraction(osc.pitchRatio),
        pitchRatio: undefined,
      }));
      instrument.version = "0.4.0";
    case "0.4.0":
      break;
    default:
      throw new Error("UNRECOGNIZED VERSION: " + instrument.version);
  }
  if (instrument.version !== VERSION) {
    throw new Error("Migration has failed to set correct instrument version.");
  }
  return instrument;
}
