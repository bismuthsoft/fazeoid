import type {Instrument} from '$lib/Instrument'
import Voice from './Voice.js'
import type {VoiceParams} from './Voice.js'

export type Note  = {
    note: number; // Frequency
    instrumentIndex: number;
    uid: number;
}

export class Mixer {
    srate = 48000;
    private voices: Voice[] = [];
    private instruments: Instrument[] = [];

    constructor () {
    }

    writeWave (channels: Float32Array[]) {
        channels.forEach((c) => c.fill(0));
        this.voices.map((voice) => voice.addWave(channels));
    }

    setSrate (srate: number) {
        this.srate = srate;
    }

    noteDown (note: Note) {
        const instrument = this.instruments[note.instrumentIndex];
        if (instrument) {
            const params = this.createVoiceParams(instrument, note);
            this.voices.push(new Voice(params));
        } else {
            console.log(`Cannot play note with uninitialized instrument: ${note}`);
        }
    }

    noteUp (uid: number) {
        const index = this.voices.findIndex((v) => v.params.uid === uid);
        if (index > -1) {
            this.voices.splice(index, 1);
        } else {
            console.log(`Bad note up ${uid}`);
        }
    }

    setInstrument (index: number, instrument: Instrument) {
        this.instruments[index] = instrument;
    }

    createVoiceParams (instrument: Instrument, note: Note) : VoiceParams {
        return {
            srate: this.srate,
            volume: decibelToScale(instrument.volume),
            oscs: instrument.oscs.map((osc) => ({
                modulation: osc.modulation.map(scaleOscillation),
                pitch: instrument.basePitch * osc.pitchRatio * calcPitch(note.note),
            })),
            uid: note.uid,
            instrumentIndex: note.instrumentIndex,
        }
    }
}

function calcPitch(note: number) {
    return Math.pow(2.0, (note - 60)/12.0);
}

function decibelToScale (db: number) :number {
    return Math.pow(2.0, db/6.0) / 2.0;
}

// Depth 0-10 scaled to number 0-1020
function scaleOscillation (depth: number) :number {
    return Math.pow(2, depth) * 4 - 4;
}
