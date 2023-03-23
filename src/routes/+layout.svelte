<slot />

<style global>
  body {
    --highlight: #00a8a87f;
    --highlight-opaque: #00bfff;
    --highlight-gradient: radial-gradient(#6ff, #44c);
    --background: #2030309f;
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
  button {
    padding: 0.5rem 0.6rem 0.3rem 0.6rem;
  }
  button,
  input,
  .controlBG {
    transition: 0.3s;
    border: none;
    color: white;
    border-radius: 0.5em;
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
    background: var(--highlight-gradient);
    fill: var(--highlight-gradient);
  }
  button:disabled,
  input:disabled,
  .controlBG:disabled {
    background: var(--background);
    fill: var(--background);
    opacity: 0.5;
  }
</style>
