import type { Instrument, OscillatorParams } from './instrument';

export function migrateInstrument (instrument: any): Instrument {
    switch (instrument.version) {
        case '0.0.1':
            instrument.oscs = instrument.oscs.map((osc: OscillatorParams) => ({
                ...osc,
                envelope: osc.envelope.tag !== 'adsr' ? osc.envelope : {
                    ...osc.envelope,
                    attack: 1 / osc.envelope.attack,
                    decay: (1 - osc.envelope.sustain) / osc.envelope.decay,
                    release: 1 / osc.envelope.release,
                }
            }))
            instrument.version = '0.0.2';
        case '0.0.2':  // Latest version
            break;
        default:
            throw new Error('UNRECOGNIZED VERSION: ' + instrument.version);
    }
    return instrument;
}
