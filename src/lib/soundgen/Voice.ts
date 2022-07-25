import type {EnvelopeParams} from '$lib/Instrument'

export type VoiceParams = {
    srate: number;
    volume: number; // Volume amount 0.0 thru 1.0.
    instrumentIndex: number;
    envelope: EnvelopeParams;
    oscs: OscillatorParams[];
    gate: boolean;
    uid: number;
}

export type OscillatorParams = {
    modulation: number[]; // How much to mix from previous oscillators
    pitch: number; // Actual pitch
}

export default class Voice {
    private oscs: Oscillator[];
    private envelope: Envelope;

    constructor (public params: VoiceParams)
    {
        this.oscs = params.oscs.map((osc) => new Oscillator(this, osc));
        this.envelope = new Envelope(this, params.envelope)
    }

    addWave (channels: Float32Array[]) {
        channels.forEach(channel => {
            const oscCache: number[] = [];
            for (let i=0; i<channel.length; ++i) {
                this.oscs.forEach((osc: Oscillator, i: number) => {
                    oscCache[i] = osc.getSample();
                    osc.params.modulation.forEach((depth: number, i: number) =>
                        osc.modulateWith(oscCache[i], depth))
                })
                channel[i] += oscCache[this.oscs.length-1] * this.params.volume * this.envelope.position;
                this.envelope.stepPosition();
            }
        });
    }

    isStopped () : boolean {
        return this.envelope.state === 'stopped';
    }
}

class Envelope {
    position: number; // Current position
    pointIndex = 0; // 1-indexed envelope point index
    segmentTimer = 0; // Countdown timer for current envelope segment
    slope = 0; // Rate at which to adjust position based on current segment
    stepRate: number; // Multiplier to fix slope rates to envelope update rate
    state: 'normal' | 'sustain' | 'release' | 'stopped'; // State

    constructor (public parent: Voice,
                 public params: EnvelopeParams)
    {
        this.state = 'normal';
        this.position = this.params.points[0].y;
        this.stepRate = 1.0 / this.parent.params.srate;
        this.nextPoint();
    }

    stepPosition () {
        if (this.state === 'normal') {
            if (this.parent.params.gate) {
                this.segmentTimer -= this.stepRate;
                if (this.segmentTimer > 0) {
                    this.position += this.slope;
                } else {
                    this.nextPoint();
                }
            } else {
                this.state = 'release';
            }
        } else if (this.state === 'sustain') {
            if (this.parent.params.gate) {
                this.position = this.params.points[this.pointIndex - 1].y;
            } else {
                this.state = 'release';
            }
        } else if (this.state === 'release') {
            this.position -= this.params.release * this.stepRate;
            if (this.position < 0) {
                this.position = 0;
                this.state = 'stopped';
            }
        } else { // state === 'stopped'
            this.position = 0;
        }
    }

    nextPoint () {
        // Assumption: entered from normal state
        ++this.pointIndex;
        if (this.pointIndex === this.params.sustainPoint) {
            this.state = 'sustain';
        } else if (this.pointIndex > this.params.points.length) {
            this.state = 'release';
        } else {
            const p1 = this.params.points[this.pointIndex-1];
            const p2 = this.params.points[this.pointIndex];
            if (p2) {
                this.position = p1.y;
                this.segmentTimer += p2.dx;
                this.slope = (p2.y - p1.y) / p2.dx * this.stepRate;
            }
        }
    }
}

class Oscillator {
    phase = 0;
    phaseadd = 1;

    constructor (public parent: Voice,
                 public params: OscillatorParams)
    {
        this.calcFrequency();
    }

    calcFrequency () {
        this.phaseadd = Math.PI * 2.0 * this.params.pitch / this.parent.params.srate;
    }

    getSample () {
        this.phase += this.phaseadd;
        return Math.sin(this.phase);
    }

    modulateWith (sample: number, modDepth: number) {
        this.phase += sample * modDepth / this.parent.params.srate * 100;
    }
}
