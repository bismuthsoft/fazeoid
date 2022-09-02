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
        case '0.0.2':
            instrument.title = instrument.title ?? 'Instrument';
        case '0.0.3':  // Latest version
            instrument.oscs = instrument.oscs.map((osc: OscillatorParams) => ({
                ...osc,
                wave: 'sine',
            }))
            instrument.version = '0.0.4-dev1';
        case '0.0.4-dev1':
            break;
        default:
            throw new Error('UNRECOGNIZED VERSION: ' + instrument.version);
    }
    console.log(instrument);
    return instrument;
}
