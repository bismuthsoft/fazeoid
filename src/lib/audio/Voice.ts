import type {
    Instrument,
    Note,
    OscillatorParams,
    WaveType,
} from "./instrument";
import { MIN_VOLUME } from "./instrument";
import { Envelope } from "./envelope";
import { WaveTable } from "./WaveTable";

const MOD_RATE = 500.0; // Used to set global modulation
const FILTER_FREQ = 8000.0; // Lowpass filter for oscillators
const FILTER_STAGES = 4;

export default class Voice {
    gate: boolean;
    volume!: number; // Volume amount 0.0 thru 1.0.
    instrumentIndex: number;
    srate: number;

    private oscs!: Oscillator[];
    private modMatrix!: number[][];
    private outVolumes!: number[];

    constructor(instrument: Instrument, public note: Note, srate: number) {
        this.instrumentIndex = note.instrumentIndex;
        this.srate = srate;
        this.gate = true;

        this.setInstrument(instrument);
    }

    // Initial playback
    setInstrument(instrument: Instrument) {
        this.oscs = instrument.oscs.map((osc: OscillatorParams, index) => {
            const pitch = this.calcPitch(instrument, index);
            const envelope = new Envelope(osc.envelope, this.srate);
            return new Oscillator(pitch, envelope, this.srate, osc.wave);
        });
        this.setModMatrix(instrument);
        this.setOutVolumes(instrument);
    }

    // Live edit instrument
    updateInstrument(instrument: Instrument) {
        instrument.oscs.forEach((_osc: OscillatorParams, index) => {
            this.oscs[index].wave = _osc.wave;
            // MUST BE DONE IN THIS ORDER. SET WAVE THEN PITCH.
            this.oscs[index].setPitch(this.calcPitch(instrument, index));
        });
        this.setModMatrix(instrument);
        this.setOutVolumes(instrument);
    }

    private setModMatrix(instrument: Instrument) {
        this.modMatrix = instrument.oscs.map((osc: OscillatorParams) =>
            osc.modulation.map(scaleOscillation)
        );
    }

    private setOutVolumes(instrument: Instrument) {
        this.outVolumes = instrument.oscs.map(({ volume }: OscillatorParams) =>
            decibelToScale(volume)
        );
    }

    // Calculate the pitch for an oscillator on self
    private calcPitch(instrument: Instrument, index: number) {
        let frac = ([a, b]: [number, number]) => a / b;
        return (
            instrument.basePitch *
            frac(instrument.oscs[index].pitchFraction) *
            noteToFreq(this.note.note)
        );
    }

    addWave(channels: Float32Array[]) {
        channels.forEach((channel) => {
            for (let i = 0; i < channel.length; ++i) {
                const oscs = this.getOscillators();
                channel[i] += oscs.reduce(
                    (acc, x, i) => acc + x * this.outVolumes[i],
                    0
                );
            }
        });
    }

    getOscillators(): number[] {
        const oscCache: number[] = [];
        this.oscs.forEach((osc: Oscillator, i: number) => {
            oscCache[i] = osc.getSample();
            this.modMatrix[i].forEach((depth: number, i: number) =>
                osc.modulateWith(
                    oscCache[i],
                    depth * noteToFreq(this.note.note)
                )
            );
            osc.envelope.stepPosition(this.gate);
        });
        return oscCache;
    }

    isStopped(): boolean {
        return !this.oscs.some(
            (osc, i) => this.outVolumes[i] > 0 && !osc.envelope.isStopped()
        );
    }
}

function noteToFreq(note: number) {
    return Math.pow(2.0, (note - 69) / 12.0);
}

function decibelToScale(db: number): number {
    return db <= MIN_VOLUME ? 0 : Math.pow(2.0, db / 6.0);
}

// Depth 0-100 scaled from 0 to 1000 using a x^e curve
function scaleOscillation(depth: number): number {
    return Math.min(Math.pow(depth / 100.0, Math.E) * MOD_RATE);
}

class Oscillator {
    lastPhase = 0;
    phase = 0;
    maxFreq = 24000;

    private waveTable: WaveTable;
    private filter: Filter;

    constructor(
        public pitch: number,
        public envelope: Envelope,
        public srate: number,
        public wave: WaveType
    ) {
        this.maxFreq = Math.min(this.maxFreq, this.srate / 2.0);
        this.waveTable = new WaveTable(srate);
        this.filter = new Filter(FILTER_FREQ / srate, FILTER_STAGES);
    }

    setPitch(pitch: number) {
        this.pitch = pitch;
    }

    getSample(): number {
        this.phase += this.pitch / this.srate; // Base pitch
        // Calc wave pitch
        const phaseStep = Math.abs(this.phase - this.lastPhase);
        let realPitch = phaseStep * this.srate;
        if (realPitch == 0) realPitch = 1;
        this.lastPhase = this.phase;
        const sample = this.waveTable.getSample(
            this.wave,
            realPitch,
            this.phase
        );
        return this.filter.step(sample * this.envelope.getPosition());
    }

    modulateWith(sample: number, modDepth: number) {
        this.phase += ((sample * modDepth) / this.srate) * 100;
    }
}

class Filter {
    private filters: OnePole[];

    constructor(fc: number, poles: number) {
        this.filters = Array(poles).fill(0).map(() => new OnePole(fc));
    }

    step(sample: number) {
        return this.filters.reduce((acc, f) => f.step(acc), sample);
    }
}

// https://www.earlevel.com/main/2012/12/15/a-one-pole-filter/
class OnePole {
    private z1 = 0;

    constructor(private fc: number) {}

    step(sample: number) {
        const b1 = Math.exp(-2 * Math.PI * this.fc);
        const a0 = 1.0 - b1;
        this.z1 = sample * a0 + this.z1 * b1;
        return this.z1;
    }
}
