export type VoiceParams = {
    srate: number;
    volume: number; // Volume amount 0.0 thru 1.0.
    uid: number;
    instrumentIndex: number;
    oscs: OscillatorParams[];
}

export type OscillatorParams = {
    modulation: number[]; // How much to mix from previous oscillators
    pitch: number; // Actual pitch
}

export default class Voice {
    params: VoiceParams;
    private oscs!: Oscillator[];

    constructor (params: VoiceParams) {
        this.params = params;
        this.oscs = params.oscs.map((osc) => new Oscillator(this, osc));
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
                channel[i] += oscCache[this.oscs.length-1] * this.params.volume;
            }
        });
    }
}

class Oscillator {
    phase = 0;
    phaseadd = 1;
    params: OscillatorParams;
    parent: Voice;

    constructor (parent: Voice, params: OscillatorParams) {
        this.parent = parent;
        this.params = params;
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
