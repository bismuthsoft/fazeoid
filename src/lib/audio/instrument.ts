import type {EnvelopeParams} from './envelope';
import defaultInstrumentData from './instruments/Synth Bass.json';

export const MIN_VOLUME = -72; // Volume at which things will be zeroed

export type Instrument = {
    version: '0.0.3';
    title: string; // Name of instrument
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
}

export function sineWave (numOscs = 4) : Instrument {
    return {
        title: 'Sine Wave',
        version: '0.0.3',
        basePitch: 440,
        oscs: Array(numOscs).fill(0).map((_, i) => (
            i === numOscs - 1 ? defaultOscillator(i) : {
                ...defaultOscillator(i),
                volume: -12,
            })),
    }
}

export function defaultOscillator(index: number): OscillatorParams {
    return {
        modulation: Array(index).fill(0),
        pitchRatio: 1,
        envelope: {
            tag: 'adsr',
            attack: 0.125,
            decay: 0.2,
            sustain: 0.5,
            release: 0.2,
        },
        volume: -72,
    }
}

export function defaultInstrument(): Instrument {
    return defaultInstrumentData;
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

// Remove an oscillator from an instrument
export function removeOscillator(params: Instrument, index: number): Instrument {
    if (params.oscs.length === 1) {
        console.log('Refusing to make empty instrument');
        return params;
    }
    let oscs = params.oscs.map(({modulation: mod, ...rest}) => ({
        modulation: [...mod.slice(0,index), ...mod.slice(index+1)],
        ...rest,
    }));
    console.log(oscs);
    return {
        ...params,
        oscs: [...oscs.slice(0,index), ...oscs.slice(index+1)],
    };
}

// Add an oscillator to an instrument
export function addOscillator(params: Instrument, index: number): Instrument {
    const oscs = params.oscs.map(({modulation: mod, ...rest}, i) => ({
        ...rest,
        modulation: i < index ? mod : [...mod.slice(0,index), 0, ...mod.slice(index)],
    }));
    return {
        ...params,
        oscs: [...oscs.slice(0,index), defaultOscillator(index), ...oscs.slice(index)],
    };
}
