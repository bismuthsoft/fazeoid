<slot />

<style global>
  body {
    margin: 0;
    font-family: "Helvetica Neue", "TeX Gyre Heros", Roboto, Arial, sans-serif;
  }
  button,
  input,
  select {
    border: none;
    background: #0000007f;
    color: white;
    padding: 0.3rem 0.8rem;
    font-weight: bold;
    border-radius: 0.5em 0;
  }
  button:hover,
  input:hover,
  select:hover {
    background: #000000ff;
  }
  button:active,
  input:active,
  select:active {
    background: radial-gradient(#06c, #000);
  }
  button {
    cursor: pointer;
  }
  button path {
    stroke: white;
  }
  input,
  textarea,
  select {
    font-family: inherit;
  }
  .ElegantKnob path.background {
    opacity: 0.5;
  }
  /* netlify deploy preview bar */
  div[data-netlify-deploy-id] {
    display: none;
  }
</style>
