import type {EnvelopeParams} from './envelope';

export const MIN_VOLUME = -72; // Volume at which things will be zeroed

export type Instrument = {
    version: '0.0.2';
    basePitch: number; // Base pitch in Hz
    oscs: OscillatorParams[]; // Oscillator config
}

export type OscillatorParams = {
    envelope: EnvelopeParams; // Volume envelope
    modulation: number[]; /* How much to modulate phase from previous oscillators.
                             Expected value 0 to 10. Real modulation is 2^x.
                             */
    pitchRatio: number; // Ratio of pitch from the base pitch.
    volume: number; // Volume in decibels
}

export type Note  = {
    note: number; // Frequency
    instrumentIndex: number;
    uid: number;
    drumMode: boolean; // Fixed length note
}

export function defaultInstrument (numOscs = 4) : Instrument {
    return {
        version: '0.0.2',
        basePitch: 440,
        oscs: Array(numOscs).fill(0).map((_, i) => ({
            modulation: Array(i).fill(10),
            pitchRatio: 1,
            envelope: {
                tag: 'adsr',
                attack: 0.125,
                decay: 0.2,
                sustain: 0.5,
                release: 0.2,
            },
            volume: i === numOscs-1 ? -12 : -72,
        })),
    }
}

export function randomizeInstrument (params: Instrument) : Instrument {
    return {
        ...params,
        oscs: Array(params.oscs.length).fill(0).map((_, i) => ({
            ...params.oscs[i],
            modulation: Array(i).fill(0).map(() => Math.pow(Math.random(),params.oscs.length-1)*100),
            pitchRatio: i === params.oscs.length-1 ? 1 : Math.pow(Math.random(),2) * 10,
        })),
    }
}
