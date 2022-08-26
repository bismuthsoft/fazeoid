# Fazeoid

<img alt=logo align=right src=/static/fazeoid.svg />

## What is This?

This is a synthesizer web application. It is designed to make it easy to design and visualize your own sounds.

It will eventually have MIDI input, and a way to share music and instruments with other users.

[Test it out here!](https://fazeoid.netlify.app/)

## Guide

### ADSR Envelope
The envelope controls the volume of the wave, and how it varies over time. This volume is the depth at which each wave modulates higher-numbered waves. Also, for audible waves, this is their output volume.

![](https://raw.githubusercontent.com/bismuthsoft/fazeoid/master/assets/envelopes.png)

Attack, Decay, and Release are all in seconds. Sustain is 0 to 1.0.

When a note is pressed, it will go into its attack and decay mode. It will stay at the sustain level (indicated by a short flat portion of the envelope) until released.
At any point when a note is released, the envelope will go down in volume at the rate specified by the release parameter.

TIP: For longer envelope, feel free to type in a higher value.

TIP: A value of 0 is actually a very short release as to avoid clicking. Typing in a 0 gives a genuinely instant slope, which may cause an audible click.

### Pitch Ratio
![](https://raw.githubusercontent.com/bismuthsoft/fazeoid/master/assets/pitchratio.png)

This is the pitch of a particular oscillator relative to the note pitch, before modulation is added.
If there is no modulation, the oscillator is just a wave at this pitch. For example, a pitch ratio of 1 is the same frequency as the currently playing note, 2 is twice the frequency, and 0.5 is half.
A pitch ratio of 0 means the oscillator's phase is determined entirely by the sum of modulation inputs.
If there is both a pitch ratio above 0 and modulation inputs, the phase of the wave is the sum of this base pitch and the modulation inputs.

TIP: Phase modulation synths sound the most consistent when every pitch ratio is set to some integer fraction, for example 1/4th (0.25) or 3/2s (1.5).

TIP: To emulate a volume LFO, you can set the pitch ratio to a very small number.

### Modulation
One of the best features of this synthesizer is the phase modulation matrix.

This allows the volume of a particular oscillator (the modulator) to be fed into the phase of the next oscillator (the carrier), producing the same effect as an FM synth. Many so-called FM synths are in fact phase modulation or phase distortion synthesizers.

The volume of a given input oscillator is added to the phase of a given output oscillator in the amount specified by the knob position. 0 is no modulation, 100 is the highest level of modulation. This knob is non-linear for the sake of ergonomics.

The arrow pointing in shows which oscillator is the modulator (volume -> phase) for that row or column. The carrier (which recieves phase modulation) is determined by the oscillator label at the start of the row or column.

Landscape mode matrix:

![](https://raw.githubusercontent.com/bismuthsoft/fazeoid/master/assets/modulation2.png)

Portrait mode matrix:

![](https://raw.githubusercontent.com/bismuthsoft/fazeoid/master/assets/modulation3.png)

### Volume
This is the output volume of each oscillator in decibels, with 0 being the max volume and -72 being silent. By default, only the last oscillator makes any sound. However, you can use these knobs to listen to previous oscillators, as well as to mix them into your instrument.

### Bug Reports / Feature Requests
If you find any bugs or think of features you'd like, please file an issue on our GitHub [HERE](https://github.com/bismuthsoft/fazeoid/issues).

## Running your own instance

Download this repo and install pnpm on your system. Then, go into the directory of this repository and type:

```bash
pnpm i
pnpm run dev
```

The application should then be hosted on `localhost:5173`
