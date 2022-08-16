export type EnvelopeParams = PointsEnvelope | AdsrEnvelope;

export type PointsEnvelope = {
    tag: 'points';
    points: EnvelopePoint[]; // List of envelope points.
    sustainPoint: number; // Which point (1-indexed) will sustain. 0 = none
    release: number; // Rate of release (amplitude per second)
}

export type AdsrEnvelope = {
    tag: 'adsr',
    attack: number, // Attack rate (amplitude per second)
    decay: number,  // Decay rate
    sustain: number,// Sustain level
    release: number,// Release rate
}

export type EnvelopePoint = {
    dx: number; // Time duration between this point and next (seconds)
    y: number;  // Amplitude 0-1.0
}

export function envelopeToPoints (envelope: EnvelopeParams): PointsEnvelope {
    switch (envelope.tag) {
        case 'points': return envelope;
        case 'adsr': return adsrToPoints(envelope);
    }
}

// Turn an envelope into a drum envelope made of points
export function makeDrum(envelope: EnvelopeParams): PointsEnvelope {
    return {
        ...envelopeToPoints(envelope),
        sustainPoint: 0,
    }
}


function adsrToPoints (
    {attack, decay, sustain, release}: AdsrEnvelope
) : PointsEnvelope {
    return {
        tag: 'points',
        points: [
            {dx: 0, y: 0},
            {dx: 1 / attack, y: 1},
            {dx: (1-sustain) / decay, y: sustain},
        ],
        sustainPoint: 3,
        release,
    }
}

export function flatEnvelope(level: number = 1.0, rampTime: number = 0.05): PointsEnvelope {
    return {
        tag: 'points',
        points: [{dx:0, y:0}, {dx: rampTime, y: level}],
        sustainPoint: 2,
        release: 1.0 / rampTime,
    }
}

export class Envelope {
    position: number; // Current position
    pointIndex = 0; // 1-indexed envelope point index
    segmentTimer = 0; // Countdown timer for current envelope segment
    slope = 0; // Rate at which to adjust position based on current segment
    stepRate: number; // Multiplier to fix slope rates to envelope update rate
    state: 'normal' | 'sustain' | 'release' | 'stopped'; // State
    params: PointsEnvelope;

    constructor (params: EnvelopeParams, srate: number)
    {
        this.params = envelopeToPoints(params);
        this.state = 'normal';
        this.position = this.params.points[0].y;
        this.stepRate = 1.0 / srate;
        this.nextPoint();
    }

    getPosition () : number {
        return this.position;
    }

    stepPosition (gate: boolean) {
        if (this.state === 'normal') {
            if (gate) {
                this.segmentTimer -= this.stepRate;
                if (this.segmentTimer > 0) {
                    this.position += this.slope;
                } else {
                    this.nextPoint();
                }
            } else {
                this.state = 'release';
            }
        } else if (this.state === 'sustain') {
            if (!gate) {
                this.state = 'release';
            }
        } else if (this.state === 'release') {
            this.position -= this.params.release * this.stepRate;
            if (this.position < 0) {
                this.position = 0;
                this.state = 'stopped';
            }
        } else { // state === 'stopped'
            this.position = 0;
        }
    }

    isStopped () : boolean {
        return this.state === 'stopped';
    }

    nextPoint () {
        // Assumption: entered from normal state
        ++this.pointIndex;
        if (this.pointIndex === this.params.sustainPoint) {
            this.position = this.params.points[this.pointIndex - 1].y;
            this.state = 'sustain';
        } else if (this.pointIndex > this.params.points.length) {
            this.state = 'release';
        } else {
            const p1 = this.params.points[this.pointIndex-1];
            const p2 = this.params.points[this.pointIndex];
            if (p2) {
                this.position = p1.y;
                this.segmentTimer += p2.dx;
                this.slope = (p2.y - p1.y) / p2.dx * this.stepRate;
            }
        }
    }
}
