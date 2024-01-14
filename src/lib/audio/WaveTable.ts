import type { WaveType } from "./instrument";

const TABLE_SIZE = 2048;
const minFreq = 20;
type WaveTables = { [key in WaveType]: number[][] };

const waveTables: WaveTables = {
    sine: [],
    halfSine: [],
    absSine: [],
    quarterSine: [],
    pulseSine: [],
    square: [],
};

export class WaveTable {
    constructor(srate: number) {
        createTable(srate);
    }

    getSample(wave: WaveType, freq: number, _phase: number) {
        const waveTable = waveTables[wave];
        const freqIndex = Math.max(0, Math.log2(freq / minFreq) * 2);
        const tableIndex = Math.floor(freqIndex);
        const phase = _phase < 0 ? 1 - (-_phase) % 1.0 : _phase % 1.0;
        const phaseIndex = Math.floor(phase * TABLE_SIZE);
        //Linearly interpolate between two tables (or 0)
        const t1 = waveTable[tableIndex];
        const t2 = waveTable[tableIndex + 1];
        const s1 = t1 ? t1[phaseIndex] : 0;
        const s2 = t2 ? t2[phaseIndex] : 0;
        const tableFrac = freqIndex - tableIndex;
        return s1 - tableFrac * (s2 - s1);
    }
}

function maxFreq(srate: number) {
    return Math.min(20000, srate / Math.sqrt(2) / 2);
}

let initialized = false;
// Ideally, call this function before generating any sound.
function createTable(srate: number) {
    if (initialized) {
        return;
    }
    for (let [waveType, table] of Object.entries(waveTables)) {
        for (
            let numSines = maxFreq(srate) / minFreq;
            numSines >= 1;
            numSines /= Math.sqrt(2)
        ) {
            table.push([]);
            const wave = table[table.length-1];
            for (let i = 0; i < TABLE_SIZE; ++i) {
                const phase = (i * 2 * Math.PI) / TABLE_SIZE;
                wave.push(generateSample(waveType as WaveType, phase, numSines));
            }
        }
    }
    initialized = true;
}

function generateSample(
    waveType: WaveType,
    phase: number,
    integerSines: number
): number {
    const getWave = (isSin: boolean, pitch: number, amplitude: number) => {
        const wave = isSin ? Math.sin : Math.cos;
        //        const rampLevel = this.ramp(realPitch * pitch, maxFreq);
        return wave(phase * pitch) / amplitude; // * rampLevel;
    };

    // https://www.sfu.ca/sonic-studio-webdav/handbook/Fourier_Theorem.html
    if (waveType === "sine") {
        return getWave(true, 1, 1);
    } else if (waveType === "halfSine") {
        let out = 0;
        for (let i = 1; i < integerSines / 2; i++) {
            out += getWave(false, 2 * i, i * i * 4 - 1);
        }
        return (
            (getWave(true, 1, 1) / 2 - (2 / Math.PI) * out) / (1 - 1 / Math.PI)
        );
    } else if (waveType === "absSine") {
        let out = 0;
        for (let i = 1; i < integerSines / 2; i++) {
            out += getWave(false, 2 * i, i * i * 4 - 1);
        }
        return 2 * out;
    } else if (waveType === "quarterSine") {
        // NOTE: waveType has the same harmonic profile as saw wave, but
        // different phase relationships make this more useful.

        // Generate absolute value sine
        let absSine = 0;
        for (let i = 1; i < integerSines; i++) {
            absSine -= getWave(false, i, i * i * 4 - 1);
        }
        // Multiply by pulse wave to get pulsed sine
        let square = 0;
        for (let i = 1; i < integerSines / 2; i++) {
            square += getWave(true, i * 2 - 1, i * 2 - 1);
        }
        return (absSine + 0.5) * ((square / Math.PI) * 2.0 + 0.5) * 2 - 0.5;
    } else if (waveType === "pulseSine") {
        let out = 0;
        // Generate a square wave
        for (let i = 1; i < integerSines / 2; i++) {
            out += getWave(true, i * 2 - 1, i * 2 - 1);
        }
        // Multiply by sine wave to get pulsed sine
        return Math.sin(phase * 2) * ((out / Math.PI) * 2.0 + 0.5);
    } else if (waveType === "square") {
        let out = 0;
        for (let i = 1; i < integerSines / 2; i++) {
            out += getWave(true, i * 2 - 1, i * 2 - 1);
        }
        return (out / Math.PI) * 4.0;
    }

    throw new Error(`Unknown wave type "${waveType}"!`);
}

// Ramp function for additive generation
// function ramp(f: number, rampTop: number): number {
//     if (f > rampTop) {
//         //            throw new Error(`You just tried to make a frequency ${f} above the max frequency`);
//         return 0;
//     } else {
//         return Math.pow((f - rampTop) / rampTop, 2);
//     }
// }
