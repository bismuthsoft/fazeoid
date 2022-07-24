import {Mixer} from './Mixer';

class WaveGenerator extends AudioWorkletProcessor {
    mixer: Mixer;

    constructor () {
        super();
        this.mixer = new Mixer();
        this.port.onmessage = (msg: MessageEvent) => {
            const method = msg.data[0];
            if (typeof this.mixer[method] === 'function') {
                this.mixer[method](...msg.data.splice(1));
            } else {
                console.log(`Bad message: ${msg.data}`)
            }
        }
    }
    process (_inputs: Float32Array[][],
             outputs: Float32Array[][],
             _parameters: Record<string, Float32Array>)
    : boolean
    {
        this.mixer.writeWave(outputs[0]);
        return true;
    }
}

registerProcessor('wave-generator', WaveGenerator);
