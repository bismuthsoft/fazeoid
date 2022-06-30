export default class Voice {
    stop = false;
    srate = 48000;
    numOscillators = 2;
    oscillators = [];

    constructor () {
        for (let i=0; i<this.numOscillators; ++i) {
            this.oscillators.push(new Voice());
        }
    }

    // Given an array of channels, write the voice into a buffer
    writeWave (channels) {
        if (this.stop) return;
        channels.forEach(channel => {
            for (let i=0; i<channel.length; ++i) {
                channel[i] = this.oscillators[0].getSample();
                this.oscillators[0].tensionMod = this.osciallators[1].getSample() / srate;
            }
        });
    }

    setFrequency (freq) {
        this.oscillators.forEach((osc) => osc.setPitch(freq));
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
        this.tension = this.tensionFromFrequency(freq * this.freqMultiply);
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
