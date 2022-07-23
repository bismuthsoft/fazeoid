import type {Note} from '$lib/soundgen/Mixer';
import type {Instrument} from '$lib/Instrument';

export type ControllerParams = {
    instruments: Instrument[];
    notes: Note[];
    volume: number; // Decibel number. -120 or less = muted.
}

export class SoundGenController {
    params: ControllerParams;

    private audioContext?: AudioContext;
    private waveNode?: AudioWorkletNode;
    private messagePort?: MessagePort;
    private intervalId?: number;

    constructor () {
        this.params = {
            instruments: [],
            notes: [],
            volume: 0,
        };
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

    stop() {
        if (this.audioContext) {
            this.audioContext.close();
            window.clearInterval(this.intervalId);
        }
    }

    noteDown(note: Note) {
        if (this.messagePort) {
            this.messagePort.postMessage(['noteDown', note]);
        }
    }

    noteUp(uid: number) {
        if (this.messagePort) {
            this.messagePort.postMessage(['noteUp', uid]);
        }
    }

    private sendParams() {
        if (!this.params || !this.messagePort) {
            return;
        }
//        console.log(this.params.volume, this.params.gate, params.volume)
        this.messagePort.postMessage(['setInstrument', this.params.instruments[0]]);
    }

}

