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

class Voice {
    srate = 48000;
    numOscillators = 2;
    oscillators = [];
    modDepth = 0;

    constructor () {
        for (let i=0; i<this.numOscillators; ++i) {
            this.oscillators.push(new SineWave());
        }
        this.oscillators[1].freqMultiply = 0.4;
    }

    // Given an array of channels, write the voice into a buffer
    writeWave (channels) {
        channels.forEach(channel => {
            for (let i=0; i<channel.length; ++i) {
                this.oscillators[0].modulateWith(this.oscillators[1], this.modDepth);
                channel[i] = this.oscillators[0].getSample();
            }
        });
    }

    setSrate (srate) {
        this.oscillators.forEach((osc) => osc.srate = srate);
    }

    setFrequency (freq) {
        this.oscillators.forEach((osc) => osc.setFrequency(freq));
    }

    setCarPitchRatio (r) {
        this.oscillators[1].freqMultiply = r;
    }
}

class SineWave {
    srate = 48000;
    phase = 0;
    phaseadd = 1;
    freqMultiply = 1;

    constructor () {
    }

    setFrequency (pitch) {
        this.phaseadd = Math.PI * 2.0 * pitch / this.srate;
    }

    getSample () {
        this.phase += (this.phaseadd * this.freqMultiply);
        return Math.sin(this.phase);
    }

    modulateWith (other, modDepth) {
        this.phase += other.getSample() * modDepth / this.srate * 100;
    }
}

