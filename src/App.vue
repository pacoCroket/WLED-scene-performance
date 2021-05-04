<template>
  <div class="App">
    <header class="App-header">WLED Scene Performance</header>
    <WledFinder />
  </div>
</template>

<script>
import WledFinder from "./components/WledFinder";
import "./App.scss";

export default {
  name: "App",
  components: {
    WledFinder,
  },
  data() {
    return {
      message: "Learn Vue",
    };
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
  background: rgb(65, 65, 65);
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}
</style>
