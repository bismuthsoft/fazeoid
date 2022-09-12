import type { Instrument, OscillatorParams } from './instrument';
import VERSION from '../version';

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
        case '0.0.2':
            instrument.title = instrument.title ?? 'Instrument';
        case '0.0.3':
            instrument.oscs = instrument.oscs.map((osc: OscillatorParams) => ({
                ...osc,
                wave: 'sine',
            }))
            instrument.version = '0.2.0';
        case '0.2.0':
            break;
        default:
            throw new Error('UNRECOGNIZED VERSION: ' + instrument.version);
    }
    if (instrument.version !== VERSION) {
        throw new Error('Migration has failed to set correct instrument version.')
    }
    return instrument;
}
