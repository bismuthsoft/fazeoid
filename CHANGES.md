# Version 0.2

## 5 new waveforms!

In this second release of Fazeoid, we have added 5 new waveforms in addition to the sine wave. The six waveforms now include:
 - Sine
 - Absolute Sine
 - Half Sine Wave
 - Quarter Sine
 - Pulse sine
 - Square wave
 
Try them out by clicking on one of the 6 wave buttons!

These waves are made using additive synthesis, resulting in smooth, organic sound. They open up lots of bright new possibilities, with 36 possible waveform combinations, and thousands of new sounds.

Each wave has a unique harmonic profile, carefully selected and tuned by ear. The sine wave is of course, a pure tone with no harmonics. The absolute sine, which looks like letter W, is full of even harmonics which sound pleasant and warm. The half sine, or "camel sine", is similar to the absolute sine, but with a deeper or fuller tone beneath it. The quarter sine, which looks like a shark fin, has a thick sound similar to a sawtooth wave. The pulse sine, which looks like a full sine wave switching on and off, has a thin, organic sound. And finally, the square wave is full of odd harmonics, which give it a unique power, loudness, and retro sound.

### Background

These wave shapes were inspired by the iconic OPL3 chip from the DOS era, which has 8 types of waveform. I created similar waves, but chose to pursue a more modern sound by using additive synthesis and a gentle roll off. Also, unlike the phase-modulated OPL3, this is a frequency modulated synth, meaning that all waveforms have their center of mass at 0. I originally included a triangle wave and a more mathematically perfect square, but didn't like how the triangle was too soft and similar to the sine, and how the square was too harsh. Observing that both waves rely on odd harmonics, I created a rounded square wave with a harmonic profile somewhat in between. With the sawtooth, I observed that the quarter sine has the same harmonic profile, but varying phase with a more useful shape for an FM synth, and that it was more recognizable. After selecting 6 unique waves, I realized that mathematically perfect waves don't play nicely with modulation, and I opted to make them less perfect for the sake of smoothing things out.

# Version 0.1
Initial release.

Base features:
- Sine wave generators
- Phase modulation matrix
- Responsive DJ knob UI
- Oscilloscope visualization
- Piano
- ADSR envelopes
- Instrument saving and loading
- Sleek, futuristic look
