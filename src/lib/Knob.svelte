<script>
 export let label = '';
 export let min = 0;
 export let max = 100;
 export let value = (max-min)/2 + min;
 export let log; // Set to true for logarithmic range

 const radius = 50;
 const margin = radius * 0.2;
 const circumference = 0.8;
 const innerRadius = radius - margin;

 const tickLabelWidth = radius * 0.35;
 const minTickLabel = {x: tickLabelWidth, y: radius*1.8};
 const maxTickLabel = {x: radius*2 - tickLabelWidth, y: radius*1.8};

 function angleOnKnob (position) {
     const bottomAngle = -Math.PI / 2.0;
     const leastAngle = bottomAngle - (Math.PI * circumference);
     const mostAngle = bottomAngle + (Math.PI * circumference);
     return leastAngle + position * (mostAngle-leastAngle)
 }

 function pointOnKnob (position, rad=radius) {
     const angle = angleOnKnob(position);
     const out = {x: Math.cos(angle)*rad + radius, y: Math.sin(angle)*rad + radius};
     return out;
 }

 // Value 0 thru 1, return the number on the knob there
 function valueOnKnob (v) {
     if (log) {
         return v * (max - min) + min;
     } else {
         return v * (max - min) + min;
     }
 }

 // Value min thru max, return the knob position (0 thru 1) there
 function positionOfValue (v) {
     return (v - min) / (max - min);
 }

 const numTicks = 9;
 const numTickLabels = 5;
 const outerTicks = Array(numTicks).fill(0).map((_, x) =>
     [pointOnKnob(x/(numTicks-1), innerRadius), pointOnKnob(x/(numTicks-1), radius*0.95)]
 )

 $: rangePos = value / (max - min) - min;
 $: tickMark = [pointOnKnob(rangePos, innerRadius*0.8), pointOnKnob(rangePos, innerRadius*0.3)];
</script>

<div id="knobcontainer">
    <svg viewBox="{-radius*0.1} 0 {radius*2.2} {radius*2}"
         width="{radius*2.2}" height="{radius*2}">
        {#each outerTicks as tick, idx}
            <line x1="{tick[0].x}" y1="{tick[0].y}"
                  x2="{tick[1].x}" y2="{tick[1].y}"
                  stroke="#aaa"
                  stroke-width="3"
            />
        {/each}
        <circle cx="{radius}" cy="{radius}" r="{innerRadius}"
                stroke="white" stroke-width="4" fill="black"/>
        <line x1="{tickMark[0].x}" y1="{tickMark[0].y}"
              x2="{tickMark[1].x}" y2="{tickMark[1].y}"
              stroke="red"
              stroke-width="6"
              stroke-linecap="round"
        />
        <text inline-size="{tickLabelWidth}" x="{minTickLabel.x}" y="{minTickLabel.y}" text-anchor="end" class="tickLabel">{min}</text>
        <text inline-size="{tickLabelWidth}" x="{maxTickLabel.x}" y="{maxTickLabel.y}" text-anchor="start" class="tickLabel">{max}</text>
    </svg>
    <div class="label">{label}</div>
</div>

<style>
 #knobcontainer {
     display: inline-block;
 }
 .tickLabel {
     border: solid 1px black;
     position: absolute;
     font-size: 10px;
 }
 .label, .tickLabel {
     font-family: Helvetica, Tex Gyre Heros, sans-serif;
 }
 .label {
     position: relative;
     text-align: center;
     top: -15px;
 }
</style>
