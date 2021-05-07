<template>
  <div class="App">
    <CloudSimulation />
    <div class="workspace-grid">
      <div class="header">WLED Scene Performance</div>
      <WledFinder />
    </div>
  </div>
</template>

<script>
import WledFinder from "./components/WledFinder";
import CloudSimulation from "./components/CloudSimulation";
import "./App.scss";

export default {
  name: "App",
  components: {
    WledFinder,
    CloudSimulation,
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: rgb(44, 44, 44);
  overflow-x: hidden;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}
</style>
