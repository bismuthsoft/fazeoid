import type { WaveType } from "./instrument";

const TABLE_SIZE = 2048;
const minFreq = 20;

type WaveTableEntries = number[][];

const squareTable: WaveTableEntries = [];
const sawTable: WaveTableEntries = [];

export class WaveTable {
    constructor(public srate: number) {
        createTables(srate);
    }

    getSample(waveType: WaveType, freq: number, _phase: number) {
        const phase = _phase < 0 ? 1 - (-_phase) % 1.0 : _phase % 1.0;

        switch(waveType) {
        case "sine":
            return this.getSineSample(phase, freq, this.srate/2)
        case "absSine": {
            const sine = this.getSineSample(phase, freq, this.srate/2);
            const square = this.getWaveSample(squareTable, phase, freq, this.srate/2 - freq);
            return sine * square - (2/Math.PI);
        }
        case "halfSine": {
            const sine = this.getSineSample(phase, freq, this.srate/2);
            const square = this.getWaveSample(squareTable, phase, freq, this.srate/2 - freq);
            return sine * (square/2+0.5) - (1/Math.PI);
        }
        case "pulseSine": {
            const sine = this.getSineSample(phase*2-0.25, freq*2, this.srate/2);
            const square = this.getWaveSample(squareTable, phase, freq, this.srate/2 - freq*2);
            return sine * (square/2+0.5);
        }
        case "square":
            return this.getWaveSample(squareTable, phase, freq, this.srate/2) / 2;
        case "saw": {
            return this.getWaveSample(sawTable, phase, freq, this.srate/2) / 2;
        }
        }

    }

    getSineSample(phase: number, freq: number, maxFreq: number) {
        const rampLine = 2 * (1 - freq / maxFreq);
        const amplitude = Math.min(1, Math.max(0, rampLine));
        return Math.cos(phase * 2 * Math.PI) * amplitude;
    }

    getWaveSample(waveTable: WaveTableEntries, phase: number, freq: number, maxFreq: number) {
        const phaseIndex = Math.floor(phase * TABLE_SIZE);
        const scaledFreq = freq * (this.srate / 2) / maxFreq / minFreq;
        const freqIndex = Math.max(0, Math.log2(scaledFreq) * 2);
        const tableIndex = Math.floor(freqIndex);
        // Linearly interpolate between two tables (or 0)
        const t1 = waveTable[tableIndex];
        const t2 = waveTable[tableIndex + 1];
        const s1 = t1 ? t1[phaseIndex] : 0;
        const s2 = t2 ? t2[phaseIndex] : 0;
        const tableFrac = freqIndex - tableIndex;
        return s1 + tableFrac * (s2 - s1);
    }
}

// Wave table generator

let initialized = false;

function createTables(srate: number) {
    if (initialized) {
        return;
    }
    createTable(squareTable, srate, pulseSeries(0.5));
    createTable(sawTable, srate, sawSeries);
    initialized = true;
    return;
}

type SeriesFn = (i: number) => { amplitude: number, phase: number }

// Ideally, call this function before generating any sound.
function createTable(waveTable: WaveTableEntries, srate: number, series: SeriesFn) {
    for (
        let numSines = srate / minFreq / 2 / Math.sqrt(2);
        numSines >= 1;
        numSines /= Math.sqrt(2)
    ) {
        waveTable.push([]);
        const wave = waveTable[waveTable.length-1];
        for (let i = 0; i < TABLE_SIZE; ++i) {
            const phase = (i * 2 * Math.PI) / TABLE_SIZE;
            wave.push(generateSample(phase, numSines, series));
        }
    }
}

function generateSample(
    phase: number,
    integerSines: number,
    series: SeriesFn,
) {
    let out = series(0).amplitude;
    for (let i = 1; i < integerSines; i += 1) {
        const { amplitude, phase: phaseOffset } = series(i);
        out += Math.sin(phase * i + phaseOffset) * amplitude;
    }
    return (out / Math.PI) * 4.0;
}

function sawSeries(i: number) {
    if(i == 0) {
        return { amplitude: 0, phase: 0 };
    }
    return { amplitude: 0.5 / i, phase: 0 };
}

function pulseSeries(pulseWidth: number) {
    return (i: number) => {
        if(i == 0) {
            return { amplitude: pulseWidth - 0.5, phase: 0 };
        }
        return {
            amplitude: 1 / i * Math.sin(i * Math.PI * pulseWidth),
            phase: Math.PI/2,
        };
    }
}
