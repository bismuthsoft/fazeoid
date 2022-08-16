import type {Instrument, Note, OscillatorParams} from "./instrument";
import { MIN_VOLUME } from "./instrument"
import {Envelope, makeDrum} from "./envelope";

export default class Voice {
    gate: boolean;
    volume!: number; // Volume amount 0.0 thru 1.0.
    instrumentIndex: number;
    srate: number;
    uid: number;

    private oscs!: Oscillator[];
    private modMatrix!: number[][];
    private outVolumes!: number[];

    constructor (
        instrument: Instrument,
        private note: Note,
        srate: number)
    {
        this.instrumentIndex = note.instrumentIndex;
        this.srate = srate;
        this.gate = true;
        this.uid = note.uid;

        if (note.drumMode) {
            this.setInstrument({
                ...instrument,
                oscs: instrument.oscs.map((osc) => ({
                    ...osc,
                    envelope: makeDrum(osc.envelope)
                })),
            });
        } else {
            this.setInstrument(instrument);
        }

    }

    // Initial playback
    setInstrument (instrument: Instrument) {
        this.oscs = instrument.oscs.map(
            (osc: OscillatorParams, index) => {
                const pitch = this.calcPitch(instrument, index);
                const envelope = new Envelope(osc.envelope, this.srate);
                return new Oscillator(pitch, envelope, this.srate);
            });
        this.setModMatrix(instrument);
        this.setOutVolumes(instrument);
    }

    // Live edit instrument
    updateInstrument (instrument: Instrument) {
        instrument.oscs.forEach((_osc: OscillatorParams, index) => {
            this.oscs[index].setPitch(this.calcPitch(instrument, index));
        });
        this.setModMatrix(instrument);
        this.setOutVolumes(instrument);
    }

    private setModMatrix (instrument: Instrument) {
        this.modMatrix = instrument.oscs.map((osc: OscillatorParams) =>
            osc.modulation.map(scaleOscillation));
    }

    private setOutVolumes (instrument: Instrument) {
        this.outVolumes = instrument.oscs.map(
            ({volume}: OscillatorParams) => decibelToScale(volume));
    }

    // Calculate the pitch for an oscillator on self
    private calcPitch (instrument: Instrument, index: number) {
        return instrument.basePitch *
            instrument.oscs[index].pitchRatio *
            noteToFreq(this.note.note);
    }

    addWave (channels: Float32Array[]) {
        channels.forEach(channel => {
            for (let i=0; i<channel.length; ++i) {
                const oscs = this.getOscillators();
                channel[i] += oscs.reduce(
                    (acc, x, i) => acc + x * this.outVolumes[i], 0);
            }
        });
    }

    getOscillators () : number[] {
        const oscCache: number[] = [];
        this.oscs.forEach((osc: Oscillator, i: number) => {
            oscCache[i] = osc.getSample();
            this.modMatrix[i].forEach((depth: number, i: number) =>
                osc.modulateWith(oscCache[i], depth))
            osc.envelope.stepPosition(this.gate);
        })
        return oscCache;
    }

    isStopped () : boolean {
        return !this.oscs.some((osc, i) =>
            this.outVolumes[i] > 0 && !osc.envelope.isStopped());
    }
}

function noteToFreq(note: number) {
    return Math.pow(2.0, (note - 69)/12.0);
}

function decibelToScale (db: number): number {
    return db <= MIN_VOLUME ? 0 : Math.pow(2.0, db/6.0);
}

// Depth 0-100 scaled from 0 to 1000 using a x^e curve
function scaleOscillation (depth: number): number {
    const max = 1000;
    return Math.pow(depth / 100.0, Math.E) * max;
}

class Oscillator {
    phase = 0;
    phaseadd = 1;

    constructor (private pitch: number,
                 public envelope: Envelope,
                 public srate: number)
    {
        this.calcFrequency();
    }

    setPitch (pitch: number) {
        this.pitch = pitch;
        this.calcFrequency();
    }

    calcFrequency () {
        this.phaseadd = Math.PI * 2.0 * this.pitch / this.srate;
    }

    getSample () {
        this.phase += this.phaseadd;
        return Math.sin(this.phase) * this.envelope.getPosition();
    }

    modulateWith (sample: number, modDepth: number) {
        this.phase += sample * modDepth / this.srate * 100;
    }
}
