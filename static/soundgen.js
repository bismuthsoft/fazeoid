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
                    this.srate = Number(value);
                    break;
                case 'freq':
                    this.voice.setFrequency(value);
                    break;
                case 'stop':
                    this.voice.stop = true;
                    break;
                case 'modDepth':
                    this.voice.modDepth = value;
                    break;
                default: throw new Error ('Unknown value');
            }
        }
    }
    process (inputs, outputs, parameters) {
        this.voice.writeWave(outputs[0]);
        return true;
    }
}

registerProcessor('wave-generator', WaveGenerator);

class Voice {
    stop = false;
    srate = 48000;
    numOscillators = 2;
    oscillators = [];
    modDepth = 0;

    constructor () {
        for (let i=0; i<this.numOscillators; ++i) {
            this.oscillators.push(new SineWave());
        }
        this.oscillators[1].freqMultiply = 0.5;
    }

    // Given an array of channels, write the voice into a buffer
    writeWave (channels) {
        if (this.stop) return;
        channels.forEach(channel => {
            for (let i=0; i<channel.length; ++i) {
                channel[i] = this.oscillators[0].getSample();
                this.oscillators[0].tensionMod =
                    this.modDepth * this.oscillators[1].getSample() / this.srate ;
            }
        });
    }

    setFrequency (freq) {
        this.oscillators.forEach((osc) => osc.setFrequency(freq / this.srate));
    }
}

class SineWave {
    pos = 1;
    vel = 0;
    tension = 0;
    tensionMod = 0;
    freqMultiply = 1;

    constructor () {
    }

    // Given a desired frequency, return a spring tension value which will result in a wave at this frequency.
    static tensionFromFrequency (freq) {
        // Piecewise approximation to compensate for error at higher frequencies
        const div = freq > 0.04 ? 0.1564 + 0.0565 * freq : 0.16;
        return Math.pow(freq / div, 2.0)
    }

    // Set frequency in hz
    setFrequency (freq) {
        this.tension = SineWave.tensionFromFrequency(freq * this.freqMultiply);
    }

    getSample () {
        const tension = (this.tension + this.tensionMod);
        [this.pos, this.vel] = [
            Math.min(1.0, this.pos - this.vel),
            this.vel * (1 - tension) + this.pos * tension,
        ];
        return this.pos;
    }
}

