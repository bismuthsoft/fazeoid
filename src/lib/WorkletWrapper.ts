export default class WorkletWrapper {
    private audioContext?: AudioContext;
    private waveNode?: AudioWorkletNode;
    private messagePort?: MessagePort;

    constructor () {
    }

    async setupWorklet () {
        this.audioContext = new AudioContext();
        await this.audioContext.audioWorklet.addModule('soundgen.bundle.js');
        this.waveNode = new AudioWorkletNode(this.audioContext, 'wave-generator');
        this.waveNode.connect(this.audioContext.destination);

        this.messagePort = this.waveNode.port;
        this.messagePort.postMessage(['setSrate', this.audioContext.sampleRate]);
    }

    postMessage(name: string, ...values: any[]) {
        if (this.messagePort) {
            this.messagePort.postMessage([name, ...values]);
        }
    }

    stop() {
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}
