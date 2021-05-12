<template>
  <div class="App">
    <div class="workspace-grid">
      <div class="header">WLED Scene Performance</div>
      <WledFinder />
      <CloudSimulation />
      <Footer />
    </div>
  </div>
</template>

<script>
import WledFinder from "./components/WledFinder";
import CloudSimulation from "./components/CloudSimulation";
import Footer from "./components/Footer";
import "./App.scss";

export default {
  name: "App",
  components: {
    WledFinder,
    CloudSimulation,
    Footer,
  },
  data() {
    return {
      hue: 0,
      freqHue: 50,
      interval: null,
    };
  },
  mounted() {
    // if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.runDeltaColor(), this.freqHue);
  },
  methods: {
    runDeltaColor() {
      this.hue = (this.hue + 1) % 360;
      document.documentElement.style.setProperty(
        "--delta-font-color",
        `hsl(${this.hue}, 60%, 50%)`
      );
    },
  },
};
</script>

<style>
:root {
  --delta-font-color: hsl(0, 0%, 0%);
}
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #131313;
  overflow-x: hidden;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}
.header {
  font-size: 2.5rem;
  font-weight: 600;
  /* Fallback: Set a background color. */
  background-color: var(--delta-font-color);

  /* Create the gradient. */
  background-image: linear-gradient(0deg, #0000009d, #00000000);

  /* Set the background size and repeat properties. */
  background-size: 100%;
  background-repeat: repeat;

  /* Use the text as a mask for the background. */
  /* This will show the gradient as a text color rather than element bg. */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
}
</style>
