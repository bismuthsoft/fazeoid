<slot></slot>

<style global>
 body {
     margin: 0;
     font-family: "Helvetica Neue", "TeX Gyre Heros", Roboto, Arial, sans-serif;
 }
 button, input {
     border: none;
     background: #0000007f;
     color: white;
     padding: .3rem .8rem;
     font-weight: bold;
     border-radius: .5em 0;
 }
 button:hover, input:hover {
     background: #000000ff;
 }
 button:active, input:active {
     background: radial-gradient(#06c, #000)
 }
 button {
     cursor: pointer;
 }
 button path {
     stroke: white !important;
 }
 input, textarea, select {
     font-family: inherit;
 }
 .ElegantKnob path.background {
     opacity: 0.5;
 }
 /* netlify deploy preview bar */
 div[data-netlify-deploy-id] {
     display: none
 }
</style>
