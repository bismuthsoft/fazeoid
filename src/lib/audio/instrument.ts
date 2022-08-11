import type {EnvelopeParams} from './envelope';

export type Instrument = {
    basePitch: number; // Base pitch in Hz
    volume: number; // Volume in decibels
    oscs: OscillatorParams[]; // Oscillator config
}

export type OscillatorParams = {
    envelope: EnvelopeParams; // Volume envelope
    modulation: number[]; /* How much to modulate phase from previous oscillators.
                             Expected value 0 to 10. Real modulation is 2^x.
                             */
    pitchRatio: number; // Ratio of pitch from the base pitch.
}

export type Note  = {
    note: number; // Frequency
    instrumentIndex: number;
    uid: number;
}

export function defaultInstrument (numOscs = 4) : Instrument {
    return {
        basePitch: 440,
        volume: -12,
        oscs: Array(numOscs).fill(0).map((_, i) => ({
            modulation: Array(i).fill(10),
            pitchRatio: 1,
            envelope: {
                tag: 'adsr',
                attack: 8,
                decay: 5,
                sustain: 0.5,
                release: 5,
            },
        })),
    }
}

export function randomizeInstrument (params: Instrument) : Instrument {
    return {
        ...params,
        oscs: Array(params.oscs.length).fill(0).map((_, i) => ({
            ...params.oscs[i],
            modulation: Array(i).fill(0).map(() => Math.pow(Math.random(),2)*100),
            pitchRatio: i === params.oscs.length-1 ? 1 : Math.pow(Math.random(),2) * 10,
        })),
    }
}
