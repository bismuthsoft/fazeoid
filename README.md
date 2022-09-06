# Fazeoid

<img alt=logo align=right src=/static/fazeoid.svg />

## What is This?

This is a FM synthesizer web application. It is designed to make it easy to design and visualize your own sounds.

[Test it out here!](https://fazeoid.netlify.app/)

Supported browsers:
 - Chrome desktop
 - Chrome Android
 - Firefox desktop

Please note that Firefox Android, Safari, and all iOS browsers are unsupported.

### Help test new features
Interested in what's next? To test future features [go to Pull Requests](https://github.com/bismuthsoft/fazeoid/pulls), open a feature, and find the post by netlify (bot). Click the "Deploy Preview" link, and you will be brought to a version of Fazeoid with this testing feature enabled. If you find any issues with the new feature, please leave comments so we can fix it!

### Bug Reports / Feature Requests
If you find any bugs or think of features you'd like, [please file an issue on our GitHub](https://github.com/bismuthsoft/fazeoid/issues).

Please use the search functionality to make sure there is not already an open issue for your bug report / feature request.

## Guide

### ADSR Envelope
An envelope controls the volume of a wave over time. This volume is the depth at which each wave modulates higher-numbered waves. Also, for audible waves, this is their output volume.

![](https://raw.githubusercontent.com/bismuthsoft/fazeoid/master/assets/envelopes.png)

When a note is pressed, its volume will 'attack' up to full volume, and then 'decay' down to the sustain level. It will stay at the sustain level until released. When a note is let go, the volume will 'release' down to 0. All off this is represented by the envelope graph next to the 4 knobs.

> TIP: For longer envelope, single click a knob to type in a higher value.

> TIP: A value of 0 is actually a very short release as to avoid clicking. Typing in a 0 gives a genuinely instant slope, which may cause an audible click.

### Pitch Ratio
![](https://raw.githubusercontent.com/bismuthsoft/fazeoid/master/assets/pitchratio.png)

This is the pitch of an oscillator, which is added to the modulation inputs to determine the total pitch. A ratio of 1 is the current note, 0.5 is half, 2 is double, etc. A pitch ratio of 0 means the oscillator's pitch is determined entirely by the sum of modulation inputs.

> TIP: It sounds the most consistent when every pitch ratio is set to some integer fraction, for example 1/4th (0.25) or 3/2s (1.5).

> TIP: To emulate a pitch LFO or vibrato, you can set the pitch ratio to a very small number.

### Modulation
Modulation flows from the lowest oscillator to the highest, which causes an oscillating change in frequency -- similar to a pitch vibrato, but taken to its mathematical extreme.

The amplitude of each oscillator changes the frequency of each higher-numbered oscillator by the amount specified in the modulation matrix. The number and arrow shows which oscillator is the source (modulator) for that row or column. The destination (carrier) is determined by the oscillator label at the start of the row or column. Oscillator 1 can only be a modulator, and Oscillator 4 can only be a carrier. Oscillators between function both as carriers and modulators; modulation flows into them and is transformed into a different modulation which flows out.

Modulation depth range ((x/100) ^ e)
 - 0 No modulation
 - 25 25Hz
 - 50 150Hz
 - 75 450Hz
 - 100 1000Hz

Landscape mode matrix:

<img src=https://raw.githubusercontent.com/bismuthsoft/fazeoid/master/assets/modulation2.png style="width:60%"></img>

Portrait mode matrix:

<img src=https://raw.githubusercontent.com/bismuthsoft/fazeoid/master/assets/modulation3.png style="width:70%"></img>

### Volume
This is the output volume of each oscillator in decibels, with 0 being the max volume and -72 being silent. By default, only the last oscillator makes any sound. However, you can use these knobs to hear any oscillator.

## Running your own instance

Download this repo and install pnpm on your system. Then, go into the directory of this repository and type:

```bash
pnpm i
pnpm run dev
```

The application should then be hosted on `localhost:5173`
