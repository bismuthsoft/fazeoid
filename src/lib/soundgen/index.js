import Voice from './Voice.js';

class WaveGenerator extends AudioWorkletProcessor {
    stop = false;

    constructor () {
        super();
        this.voice = new Voice();
        this.port.onmessage = (msg) => {
            const [id, value] = msg.data;
            switch (id) {
                case 'srate':
                    this.voice.setSrate(value);
                    break;
                case 'params':
                    this.voice.setParams(value);
                    break;
                case 'stop':
                    this.stop = true;
                    break;
                default: throw new Error ('Unknown value');
            }
        }
    }
    process (inputs, outputs, parameters) {
        if (this.stop) return;
        this.voice.writeWave(outputs[0]);
        return true;
    }
}

registerProcessor('wave-generator', WaveGenerator);
