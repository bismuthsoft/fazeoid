import Voice from './Voice.js';

class WaveGenerator extends AudioWorkletProcessor {
    voice: Voice;

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
                default: throw new Error ('Unknown value');
            }
        }
    }
    process (_inputs: Float32Array[][],
             outputs: Float32Array[][],
             _parameters: Record<string, Float32Array>)
    : boolean
    {
        this.voice.writeWave(outputs[0]);
        return true;
    }
}

registerProcessor('wave-generator', WaveGenerator);
