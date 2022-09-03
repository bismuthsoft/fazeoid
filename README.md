# Fazeoid

<img alt=logo align=right src=/static/fazeoid.svg />

## What is This?

This is a synthesizer web application. It is designed to make it easy to design and visualize your own sounds.

[Test it out here!](https://fazeoid.netlify.app/)

Supported browsers:
 - Chrome desktop
 - Chrome Android
 - Firefox desktop

Unspported browsers:
 - Firefox Android
 - Safari
 - Chrome iOS

### Help test new features
Interested in what's next? To test future features [go to Pull Requests](https://github.com/bismuthsoft/fazeoid/pulls), open a feature, and find the post by netlify (bot). Click the "Deploy Preview" link, and you will be brought to a version of Fazeoid with this testing feature enabled. If you find any issues with the new feature, please leave comments so we can fix it!

### Bug Reports / Feature Requests
If you find any bugs or think of features you'd like, please file an issue on our GitHub [HERE](https://github.com/bismuthsoft/fazeoid/issues).

Please use the search functionality to make sure there is not already an open issue for your bug report / feature request.

## Guide

### ADSR Envelope
An envelope controls the volume of a wave over time. This volume is the depth at which each wave modulates higher-numbered waves. Also, for audible waves, this is their output volume.

![](https://raw.githubusercontent.com/bismuthsoft/fazeoid/master/assets/envelopes.png)

When a note is pressed, its volume will 'attack' up to full volume, and then 'decay' down to the sustain level. It will stay at the sustain level until released. When a note is let go, the volume will 'release' down to 0. This is represented by the envelope graph next to the 4 knobs.

TIP: For longer envelope, feel free to type in a higher value.

TIP: A value of 0 is actually a very short release as to avoid clicking. Typing in a 0 gives a genuinely instant slope, which may cause an audible click.

### Pitch Ratio
![](https://raw.githubusercontent.com/bismuthsoft/fazeoid/master/assets/pitchratio.png)

This is the pitch of an oscillator, which is added to the modulation inputs to determine the total pitch.

If there is no modulation, the oscillator is just a wave at this pitch. For example, a pitch ratio of 1 is the same frequency as the currently playing note, 2 is twice the frequency, and 0.5 is half.
A pitch ratio of 0 means the oscillator's phase is determined entirely by the sum of modulation inputs.
If there is both a pitch ratio above 0 and modulation inputs, the phase of the wave is the sum of this base pitch and the modulation inputs.

TIP: Phase modulation synths sound the most consistent when every pitch ratio is set to some integer fraction, for example 1/4th (0.25) or 3/2s (1.5).

TIP: To emulate a pitch LFO, you can set the pitch ratio to a very small number.

### Modulation
#### What is Phase Modulation?
The type of modulation used is called "phase modulation", but it is pretty much the same as FM, or "frequency modulation". It works like this: one wave is the "modulator", this is the lower-numbered wave. The other is the "carrier", the higher-numbered wave. The modulator's amplitude is used to change the carrier's phase. When the modulator has a positive amplitude (the wave is in the top half of the scope), it is raising the pitch of the carrier wave (adding to the carrier's phase). When it has a negative amplitude, it is lowering the pitch (subtracting from its phase). This causes the pitch of the carrier wave to vary at the frequency of the modulator, which results in a harmonically rich signal characteristic of FM synths.

#### The Modulation Matrix
The modulation matrix controls how much each oscillator modulates higher-numbered oscillators. The volume of a modulator is added to the phase of a carrier in the amount specified by the knob position. 0 is no modulation, 100 is the highest level of modulation. This knob is non-linear for the sake of ergonomics.

The arrow pointing in shows which oscillator is the modulator for that row or column. The carrier is determined by the oscillator label at the start of the row or column.

Landscape mode matrix:

![](https://raw.githubusercontent.com/bismuthsoft/fazeoid/master/assets/modulation2.png)

Portrait mode matrix:

![](https://raw.githubusercontent.com/bismuthsoft/fazeoid/master/assets/modulation3.png)

### Volume
This is the output volume of each oscillator in decibels, with 0 being the max volume and -72 being silent. By default, only the last oscillator makes any sound. However, you can use these knobs to hear any oscillator.

## Running your own instance

Download this repo and install pnpm on your system. Then, go into the directory of this repository and type:

```bash
pnpm i
pnpm run dev
```

The application should then be hosted on `localhost:5173`
