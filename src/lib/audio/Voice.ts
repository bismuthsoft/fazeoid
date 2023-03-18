import type { Instrument, Note, OscillatorParams, WaveType } from "./instrument";
import { MIN_VOLUME } from "./instrument"
import { Envelope } from "./envelope";


export default class Voice {
    gate: boolean;
    volume!: number; // Volume amount 0.0 thru 1.0.
    instrumentIndex: number;
    srate: number;
    uid: number;

    private oscs!: Oscillator[];
    private modMatrix!: number[][];
    private outVolumes!: number[];

    constructor(
        instrument: Instrument,
        private note: Note,
        srate: number) {
        this.instrumentIndex = note.instrumentIndex;
        this.srate = srate;
        this.gate = true;
        this.uid = note.uid;

        this.setInstrument(instrument);
    }

    // Initial playback
    setInstrument(instrument: Instrument) {
        this.oscs = instrument.oscs.map(
            (osc: OscillatorParams, index) => {
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
            osc.modulation.map(scaleOscillation));
    }

    private setOutVolumes(instrument: Instrument) {
        this.outVolumes = instrument.oscs.map(
            ({ volume }: OscillatorParams) => decibelToScale(volume));
    }

    // Calculate the pitch for an oscillator on self
    private calcPitch(instrument: Instrument, index: number) {
        let frac = ([a, b]: [number, number]) => a / b;
        return instrument.basePitch *
            frac(instrument.oscs[index].pitchFraction) *
            noteToFreq(this.note.note);
    }

    addWave(channels: Float32Array[]) {
        channels.forEach(channel => {
            for (let i = 0; i < channel.length; ++i) {
                const oscs = this.getOscillators();
                channel[i] += oscs.reduce(
                    (acc, x, i) => acc + x * this.outVolumes[i], 0);
            }
        });
    }

    getOscillators(): number[] {
        const oscCache: number[] = [];
        this.oscs.forEach((osc: Oscillator, i: number) => {
            oscCache[i] = osc.getSample();
            this.modMatrix[i].forEach((depth: number, i: number) =>
                osc.modulateWith(oscCache[i], depth))
            osc.envelope.stepPosition(this.gate);
        })
        return oscCache;
    }

    isStopped(): boolean {
        return !this.oscs.some((osc, i) =>
            this.outVolumes[i] > 0 && !osc.envelope.isStopped());
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
    const max = 1000;
    return Math.pow(depth / 100.0, Math.E) * max;
}

class Oscillator {
    lastPhase = 0;
    phase = 0;
    maxFreq = 20000;

    constructor(private pitch: number,
        public envelope: Envelope,
        public srate: number,
        public wave: WaveType) {
    }

    setPitch(pitch: number) {
        this.pitch = pitch;
    }

    // Ramp function for additive generation
    ramp(f: number, rampTop: number): number {
        if (f > rampTop) {
            //            throw new Error(`You just tried to make a frequency ${f} above the max frequency`);
            return 0;
        } else {
            return Math.pow((f - rampTop) / rampTop, 2);
        }
    }

    getSample(): number {
        this.phase += Math.PI * 2.0 * this.pitch / this.srate; // Base pitch
        // Calc wave pitch
        const phaseStep = Math.abs(this.phase - this.lastPhase);
        let realPitch = phaseStep * this.srate / Math.PI / 2.0;
        if (realPitch == 0) realPitch = 1;

        // How many integer harmonics can fit before passing nyquist frequency?
        const MAX_SINES = 20; // Maximum number of times to generate sine waves
        const maxFreq = Math.min(this.maxFreq, MAX_SINES * realPitch);
        const integerSines = Math.floor(maxFreq / realPitch);

        const getWave = (isSin: boolean, pitch: number, amplitude: number) => {
            const wave = isSin ? Math.sin : Math.cos;
            const rampLevel = this.ramp(realPitch * pitch, maxFreq);
            return wave(this.phase * pitch) / amplitude * rampLevel;
        }

        let out = 0;
        if (integerSines == 0) {
        }
        // https://www.sfu.ca/sonic-studio-webdav/handbook/Fourier_Theorem.html
        else if (this.wave === 'sine') {
            out = getWave(true, 1, 1);
        } else if (this.wave === 'halfSine') {
            for (let i = 1; i < integerSines / 2 && i < MAX_SINES; i++) {
                out += getWave(false, 2 * i, i * i * 4 - 1);
            }
            out = (getWave(true, 1, 1) / 2 - 2 / Math.PI * out) / (1 - 1 / Math.PI);
        } else if (this.wave === 'absSine') {
            for (let i = 1; i < integerSines / 2 && i < MAX_SINES; i++) {
                out += getWave(false, 2 * i, i * i * 4 - 1);
            }
            out = 2 * out;
        } else if (this.wave === 'quarterSine') {
            // NOTE: this wave has the same harmonic profile as saw wave, but
            // different phase relationships make this more useful.

            // Generate absolute value sine
            let absSine = 0;
            for (let i = 1; i < integerSines && i < MAX_SINES / 2; i++) {
                absSine -= getWave(false, i, i * i * 4 - 1);
            }
            // Multiply by pulse wave to get pulsed sine
            let square = 0;
            for (let i = 1; i < integerSines / 2 && i < MAX_SINES / 2; i++) {
                square += getWave(true, i * 2 - 1, i * 2 - 1);
            }
            out = (absSine + 0.5) * (square / Math.PI * 2.0 + 0.5) * 2 - 0.5;
        } else if (this.wave === 'pulseSine') {
            // Generate a square wave
            for (let i = 1; i < integerSines / 2 && i < MAX_SINES; i++) {
                out += getWave(true, i * 2 - 1, i * 2 - 1);
            }
            // Multiply by sine wave to get pulsed sine
            out = Math.sin(this.phase * 2) * (out / Math.PI * 2.0 + 0.5);
        } else if (this.wave === 'square') {
            for (let i = 1; i < integerSines / 2 && i < MAX_SINES; i++) {
                out += getWave(true, i * 2 - 1, i * 2 - 1);
            }
            out = out / Math.PI * 4.0;
        }

        this.lastPhase = this.phase;
        return out * this.envelope.getPosition();
    }

    modulateWith(sample: number, modDepth: number) {
        this.phase += sample * modDepth / this.srate * 100;
    }
}
