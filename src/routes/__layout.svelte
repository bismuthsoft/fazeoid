<slot></slot>

<style global>
 /* latin */
 @font-face {
     font-family: 'Genos';
     font-style: italic;
     font-weight: 900;
     size-adjust: 120%;
     font-display: swap;
     src: url(https://fonts.gstatic.com/s/genos/v6/SlGPmQqPqpUOYRwqWzksdKTv0zsAYgup6Xi5A7I.woff2) format('woff2');
     unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
 }
 /* latin-ext */
 @font-face {
     font-family: 'Genos';
     font-style: italic;
     font-weight: 900;
     size-adjust: 120%;
     font-display: swap;
     src: url(https://fonts.gstatic.com/s/genos/v6/SlGPmQqPqpUOYRwqWzksdKTv0zsAYgup6Xi3A7JMAg.woff2) format('woff2');
     unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
 }
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
 button path {
     stroke: white !important;
 }
 input, textarea, select {
     font-family: inherit;
 }
</style>
