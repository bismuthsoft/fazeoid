<script>
 export let value;
 export let label = "";
 export let min = 0;
 export let max; // MANDATORY
 export let log; // Set to true for logarithmic slider

function powTransform (v) {
     let pow = (x) => Math.pow(x, 2);

     let powv = pow(v);
     let powmin = pow(min);
     let powmax = pow(max);

     let norm = (powv - powmin) / (powmax - powmin);
     let scaled = (norm * (max - min)) + min;

     return scaled;
 }

 function onChange (ev) {
     let v = ev.target.value;
     if (log) {
         value = powTransform(v);
     } else {
         value = v;
     }
 }
</script>

<div class="slidecontainer">
    {label} = {value} <br/>
    <input type="range" min={min} max={max} on:input="{onChange}" step="{(max-min) / 65536}" class="slider" id="pitch">
</div>

<style>
/* The slider itself */
 .slider {
     -webkit-appearance: none;  /* Override default CSS styles */
     appearance: none;
     width: 100%; /* Full-width */
     height: 25px; /* Specified height */
     background: #d3d3d3; /* Grey background */
     outline: none; /* Remove outline */
     opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
     -webkit-transition: .2s; /* 0.2 seconds transition on hover */
     transition: opacity .2s;
 }

 /* Mouse-over effects */
 .slider:hover {
     opacity: 1; /* Fully shown on mouse-over */
 }

 /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
 .slider::-webkit-slider-thumb {
     -webkit-appearance: none; /* Override default look */
     appearance: none;
     width: 25px; /* Set a specific slider handle width */
     height: 25px; /* Slider handle height */
     background: #04AA6D; /* Green background */
     cursor: pointer; /* Cursor on hover */
 }

 .slider::-moz-range-thumb {
     width: 25px; /* Set a specific slider handle width */
     height: 25px; /* Slider handle height */
     background: #04AA6D; /* Green background */
     cursor: pointer; /* Cursor on hover */
 }
</style>
