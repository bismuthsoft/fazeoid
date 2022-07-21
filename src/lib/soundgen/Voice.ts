export type VoiceParams = {
    volume: number; // Volume amount 0.0 thru 1.0.
    oscs: OscillatorParams[];
}

export type OscillatorParams = {
    modulation: number[]; // How much to mix from previous oscillators
    pitch: number; // Actual pitch
}

export default class Voice {
    srate = 48000;
    private oscs: Oscillator[];
    private params: VoiceParams;

    constructor () {
        this.oscs = [];
        this.params = {volume: 0, oscs: []};
    }

    // Given an array of channels, write the voice into a buffer
    writeWave (channels: Float32Array[]) {
        channels.forEach(channel => {
            const oscCache: number[] = [];
            for (let i=0; i<channel.length; ++i) {
                this.oscs.forEach((osc: Oscillator, i: number) => {
                    oscCache[i] = osc.getSample();
                    this.oscs[i].params.modulation.forEach((depth: number, i: number) =>
                        osc.modulateWith(oscCache[i], depth))
                })
                channel[i] = oscCache[this.oscs.length-1] * this.params.volume;
            }
        });
    }

    setParams (params: Required<VoiceParams>) {
        const numOscs = params.oscs.length;
        if (this.oscs.length !== numOscs) {
            this.oscs = Array(numOscs).fill(0).map(() => new Oscillator(this));
        }
        this.oscs.forEach((osc: Oscillator, index: number) => {
            osc.params = params.oscs[index];
            osc.calcFrequency();
        });
        this.params = params;
    }

    setSrate (srate: number) {
        this.srate = srate;
    }
}

class Oscillator {
    phase = 0;
    phaseadd = 1;
    params: OscillatorParams;
    parent: Voice;

    constructor (parent: Voice) {
        this.parent = parent;
        this.params = {pitch: 0, modulation: []};
    }

    calcFrequency () {
        this.phaseadd = Math.PI * 2.0 * this.params.pitch / this.parent.srate;
    }

    getSample () {
        this.phase += this.phaseadd;
        return Math.sin(this.phase);
    }

    modulateWith (sample: number, modDepth: number) {
        this.phase += sample * modDepth / this.parent.srate * 100;
    }
}
