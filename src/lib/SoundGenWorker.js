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

class Voice {
    srate = 48000;
    numOscs = 2;
    oscs = [];
    modDepth = 0;

    constructor () {
        this.oscs = [];
    }

    // Given an array of channels, write the voice into a buffer
    writeWave (channels) {
        channels.forEach(channel => {
            const oscCache = [];
            for (let i=0; i<channel.length; ++i) {
                this.oscs.forEach((osc, i) => {
                    oscCache[i] = osc.getSample();
                    osc.modulation.forEach((depth, i) =>
                        osc.modulateWith(oscCache[i], depth))
                })
                channel[i] = oscCache[this.oscs.length-1] * this.volume;
            }
        });
    }

    setSrate (srate) {
        this.oscs.forEach((osc) => osc.srate = srate);
    }

    setParams ({numOscs, oscs, volume}) {
        this.volume = volume;
        if (this.oscs.length !== numOscs) {
            this.oscs = Array(numOscs).fill().map(() => new SineWave());
        }
        oscs.forEach((osc, index) => {
            const o = this.oscs[index];
            o.setFrequency(osc.pitch);
            o.modulation = osc.modulation;
        });
    }
}

class SineWave {
    srate = 48000;
    phase = 0;
    phaseadd = 1;

    constructor () {
    }

    setFrequency (pitch) {
        this.phaseadd = Math.PI * 2.0 * pitch / this.srate;
    }

    getSample () {
        this.phase += this.phaseadd;
        return Math.sin(this.phase);
    }

    modulateWith (sample, modDepth) {
        this.phase += sample * modDepth / this.srate * 100;
    }
}
