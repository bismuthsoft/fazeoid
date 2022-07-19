import Voice from './Voice.js';

class WaveGenerator extends AudioWorkletProcessor {
    pos = 1;
    vel = 0;
    tension = 0;
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
                case 'freq':
                    this.voice.setFrequency(value);
                    break;
                case 'stop':
                    this.stop = true;
                    break;
                case 'modDepth':
                    this.voice.modDepth = value;
                    break;
                case 'carPitchRatio':
                    this.voice.setCarPitchRatio(value);
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
