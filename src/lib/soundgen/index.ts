import {Mixer} from './Mixer';

class WaveGenerator extends AudioWorkletProcessor {
    mixer: Mixer;

    constructor () {
        super();
        this.mixer = new Mixer();
        this.port.onmessage = (msg) => {
            const [id, value] = msg.data;
            switch (id) {
                case 'srate':
                    this.mixer.setSrate(value);
                    break;
                case 'setInstrument':
                    this.mixer.setInstrument(0, value);
                    break;
                case 'noteDown':
                    this.mixer.noteDown(value);
                    break;
                case 'noteUp':
                    this.mixer.noteUp(value);
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
        this.mixer.writeWave(outputs[0]);
        return true;
    }
}

registerProcessor('wave-generator', WaveGenerator);
