export type SynthParams = {
    volume: number; // Decibel number. -120 or less = muted.
    numOscs: number; // Number of oscillators
    basePitch: number;
    oscs: OscillatorParams[];
}

export type OscillatorParams = {
    modulation: number[]; // How much to mix from previous oscillators
    pitchRatio: number; // Pitch relative to basePitch
}

type InnerSynthParams = {
    volume: number; // Volume amount 0.0 thru 1.0.
    oscs: InnerOscillatorParams[];
}

type InnerOscillatorParams = {
    modulation: number[]; // How much to mix from previous oscillators
    pitch: number; // Actual pitch
}

export class SoundGenController {
    params: SynthParams;

    private audioContext?: AudioContext;
    private waveNode?: AudioWorkletNode;
    private messagePort?: MessagePort;
    private intervalId?: number;

    constructor () {
        this.params = defaultParams(4);
        // MUST CALL setupWorklet() within onMount for this to be usable
    }

    async setupWorklet () {
        this.audioContext = new AudioContext();
        await this.audioContext.audioWorklet.addModule('soundgen.bundle.js');
        this.waveNode = new AudioWorkletNode(this.audioContext, 'wave-generator');
        this.waveNode.connect(this.audioContext.destination);

        this.messagePort = this.waveNode.port;
        this.messagePort.postMessage(['srate', this.audioContext.sampleRate]);

        this.intervalId = window.setInterval(() => this.writeSynthParams(), 16);
    }

    randomize() {
        this.params = randomizedParams(this.params);
    }

    stop() {
        if (this.audioContext) {
            this.audioContext.close();
            window.clearInterval(this.intervalId);
        }
    }

    writeSynthParams() {
        if (!this.params || !this.messagePort) {
            return;
        }
        const sp = this.params;
        let params: Required<InnerSynthParams> = {
            ...sp,
            volume: decibelToScale(sp.volume),
            oscs: sp.oscs.map((v) => ({
                modulation: v.modulation.map(scaleOscillation),
                pitch: sp.basePitch * v.pitchRatio,
            }))
        };
        this.messagePort.postMessage(['params', params]);
    }
}

export function defaultParams (numOscs = 4): SynthParams {
    return {
        numOscs: numOscs,
        basePitch: 600,
        volume: -12,
        oscs: Array(numOscs).fill(0).map((_, i) => ({
            modulation: Array(i).fill(0).map(() => 1),
            pitchRatio: 1,
        })),
    }
}

export function randomizedParams (params: SynthParams): SynthParams {
    return {
        ...params,
        oscs: Array(params.numOscs).fill(0).map((_, i) => ({
            ...params.oscs[i],
            modulation: Array(i).fill(0).map(() => Math.pow(Math.random(),3)*10),
            pitchRatio: Math.pow(Math.random(), 2) * 10,
        })),
    }
}

function decibelToScale (db: number) :number {
    return Math.pow(2.0, db/6.0) / 2.0;
}

// Depth 0-10 scaled to number 0-1020
function scaleOscillation (depth: number) :number {
    return Math.pow(2, depth) * 4 - 4;
}
