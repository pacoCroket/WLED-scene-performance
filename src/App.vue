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
  created() {
    this.interval = setInterval(() => this.runDeltaColor(), this.freqHue);
  },
  // unmounted() {
  //   clearInterval(this.interval);
  // },
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
  color: var(--delta-font-color);
}
</style>
