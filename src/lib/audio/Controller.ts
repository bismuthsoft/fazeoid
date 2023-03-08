export default class AudioController {
    started = false;
    audioContext?: AudioContext;
    private waveNode?: AudioWorkletNode;
    private messagePort?: MessagePort;
    private messageQueue: {name:string, values:any[]}[] = [];

    constructor() {
    }

    async setupWorklet() {
        this.audioContext = new AudioContext();
        await this.audioContext.audioWorklet.addModule('audio-worklet.js');
        this.waveNode = new AudioWorkletNode(this.audioContext, 'wave-generator');
        this.waveNode.connect(this.audioContext.destination);

        this.messagePort = this.waveNode.port;
        this.messagePort.postMessage(['setSrate', this.audioContext.sampleRate]);
        this.pushQueue();
    }

    postMessage(name: string, ...values: any[]) {
        if (this.messagePort) {
            this.messagePort.postMessage([name, ...values]);
        } else {
            this.messageQueue.push({name, values});
        }
    }

    stop() {
        if (this.audioContext) {
            this.audioContext.close();
        }
    }

    private pushQueue () {
        this.messageQueue.forEach(({name, values}) => {
            this.postMessage(name, ...values);
        });
        this.messageQueue = [];
    }
}
