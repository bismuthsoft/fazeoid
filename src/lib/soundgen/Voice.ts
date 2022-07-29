import type {Instrument, Note, OscillatorParams} from './instrument';
import {Envelope} from './envelope';

export default class Voice {
    gate: boolean;
    volume!: number; // Volume amount 0.0 thru 1.0.
    instrument!: Instrument;
    instrumentIndex: number;
    srate: number;
    uid: number;

    private oscs!: Oscillator[];
    private envelope!: Envelope;
    private modMatrix!: number[][];

    constructor (
        instrument: Instrument,
        private note: Note,
        srate: number)
    {
        this.instrumentIndex = note.instrumentIndex;
        this.srate = srate;
        this.gate = true;
        this.uid = note.uid;

        this.setInstrument(instrument);
    }

    setInstrument (instrument: Instrument) {
        this.instrument = instrument;
        this.volume = decibelToScale(instrument.volume);
        this.envelope = new Envelope(instrument.envelope, this.srate);
        this.oscs = instrument.oscs.map(
            (osc: OscillatorParams) => {
                const pitch = instrument.basePitch * osc.pitchRatio * calcPitch(this.note.note);
                return new Oscillator(pitch, this.srate);
            });
        this.modMatrix = instrument.oscs.map((osc: OscillatorParams) =>
            osc.modulation.map(scaleOscillation));
    }

    addWave (channels: Float32Array[]) {
        channels.forEach(channel => {
            for (let i=0; i<channel.length; ++i) {
                const oscs = this.getOscillators();
                channel[i] += oscs[this.oscs.length-1] * this.volume * this.envelope.getPosition();
                this.envelope.stepPosition(this.gate);
            }
        });
    }

    getOscillators () : number[] {
        const oscCache: number[] = [];
        this.oscs.forEach((osc: Oscillator, i: number) => {
            oscCache[i] = osc.getSample();
            this.modMatrix[i].forEach((depth: number, i: number) =>
                osc.modulateWith(oscCache[i], depth))
        })
        return oscCache;
    }

    isStopped () : boolean {
        return this.envelope.isStopped();
    }
}

function calcPitch(note: number) {
    return Math.pow(2.0, (note - 69)/12.0);
}

function decibelToScale (db: number) :number {
    return Math.pow(2.0, db/6.0) / 2.0;
}

// Depth 0-10 scaled to number 0-1020
function scaleOscillation (depth: number) :number {
    return Math.pow(2, depth) * 4 - 4;
}

class Oscillator {
    phase = 0;
    phaseadd = 1;

    constructor (public pitch: number,
                 public srate: number)
    {
        this.calcFrequency();
    }

    calcFrequency () {
        this.phaseadd = Math.PI * 2.0 * this.pitch / this.srate;
    }

    getSample () {
        this.phase += this.phaseadd;
        return Math.sin(this.phase);
    }

    modulateWith (sample: number, modDepth: number) {
        this.phase += sample * modDepth / this.srate * 100;
    }
}
