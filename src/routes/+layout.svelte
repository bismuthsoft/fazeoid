<slot />

<style global>
  body {
    --highlight: #0088dd7f;
    --background: #2020209f;
    --background-hover: #000000ff;
    margin: 0;
    font-family: "Helvetica Neue", "TeX Gyre Heros", Roboto, Arial, sans-serif;
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
  /* netlify deploy preview bar */
  div[data-netlify-deploy-id] {
    display: none;
  }
  button,
  input,
  .controlBG {
    transition: 0.3s;
    border: none;
    color: white;
    border-radius: 0.5em;
    padding: 0.3rem 0.8rem;
    background: var(--background);
    fill: var(--background);
  }
  button:hover,
  input:hover,
  .controlBG:hover {
    background: var(--background-hover);
    fill: var(--background-hover);
  }
  button:active,
  input:active,
  .controlBG:active {
    background: radial-gradient(#4cc, #44c);
    fill: radial-gradient(#4cc, #44c);
  }
</style>
