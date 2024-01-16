import type { WaveType } from "./instrument";

const TABLE_SIZE = 2048;
const minFreq = 20;

type WaveTableEntries = number[][];

const squareTable: WaveTableEntries = [];
const absSineTable: WaveTableEntries = [];
const sawTable: WaveTableEntries = [];

export class WaveTable {
    maxFreq: number;

    constructor(public srate: number) {
        this.maxFreq = Math.min(20000, srate / 2);
        createTables(srate, this.maxFreq);
    }

    getSample(waveType: WaveType, freq: number, _phase: number) {
        const phase = _phase < 0 ? 1 - (-_phase) % 1.0 : _phase % 1.0;

        switch(waveType) {
        case "sine":
            return this.getSineSample(phase, freq, this.maxFreq)
        case "absSine": {
            return this.getWaveSample(absSineTable, phase, freq, this.maxFreq - freq) / 2;
        }
        case "halfSine": {
            const sine = this.getSineSample(phase, freq, this.maxFreq)
            const absSine = this.getWaveSample(absSineTable, phase, freq, this.maxFreq - freq) / 2;
            return sine - absSine;
        }
        case "pulseSine": {
            const sine = this.getSineSample(phase*2-0.25, freq*2, this.maxFreq);
            const square = this.getWaveSample(squareTable, phase, freq, this.maxFreq - freq*2);
            return sine * (square/2+0.5);
        }
        case "square":
            return this.getWaveSample(squareTable, phase, freq, this.maxFreq) / 2;
        case "saw": {
            return this.getWaveSample(sawTable, phase, freq, this.maxFreq) / 2;
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
        const scaledFreq = freq * this.maxFreq / maxFreq / minFreq;
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

function createTables(srate: number, maxFreq: number) {
    if (initialized) {
        return;
    }
    createTable(squareTable, srate, maxFreq, pulseSeries(0.5));
    createTable(sawTable, srate, maxFreq, sawSeries);
    createTable(absSineTable, srate, maxFreq, absSineSeries);
    initialized = true;
    return;
}

type SeriesEntry = { amplitude: number, phase: number }
type SeriesFn = (i: number) => SeriesEntry;

// Ideally, call this function before generating any sound.
function createTable(waveTable: WaveTableEntries, srate: number, maxFreq: number, series: SeriesFn) {
    for (
        let numSines = maxFreq / minFreq;
        numSines >= Math.sqrt(2);
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
): number {
    let out = series(0).amplitude;
    for (let i = 1; i < integerSines; i += 1) {
        const { amplitude, phase: phaseOffset } = series(i);
        out += Math.sin(phase * i + phaseOffset) * amplitude;
    }
    return (out / Math.PI) * 4.0;
}

function absSineSeries(i: number): SeriesEntry {
    if(i == 0) {
        return { amplitude: 0, phase: 0 };
    }
    return { amplitude: i % 2 == 0 ? 2 / (i * i - 1) : 0, phase: Math.PI/2 };
}

function sawSeries(i: number): SeriesEntry {
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
