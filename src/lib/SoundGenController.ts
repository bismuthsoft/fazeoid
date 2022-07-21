import type {VoiceParams} from '$lib/soundgen/Voice';

export type ControllerParams = {
    volume: number; // Decibel number. -120 or less = muted.
    numOscs: number; // Number of oscillators
    basePitch: number;
    oscs: ControllerOscParams[];
}

export type ControllerOscParams = {
    modulation: number[]; // How much to mix from previous oscillators
    pitchRatio: number; // Pitch relative to basePitch
}

export class SoundGenController {
    params: ControllerParams;

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

        this.intervalId = window.setInterval(() => this.sendParams(), 16);
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

    private sendParams() {
        if (!this.params || !this.messagePort) {
            return;
        }
        const sp = this.params;
        let params: Required<VoiceParams> = {
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

export function defaultParams (numOscs = 4): ControllerParams {
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

export function randomizedParams (params: ControllerParams): ControllerParams {
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
