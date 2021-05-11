<template>
  <div ref="cloudSimulation" class="cloud-simulation"></div>
</template>
<script>
import { initCloud, setLights } from "../cloudWebGL";

export default {
  name: "CloudSimulation",
  mounted() {
    const existingCanvas = this.$refs.cloudSimulation.querySelector("canvas");
    if (existingCanvas) this.$refs.cloudSimulation.removeChild(existingCanvas);
    const threeNode = initCloud(this.$refs.cloudSimulation);
    this.$refs.cloudSimulation.appendChild(threeNode);
  },
  computed: {
    colors() {
      return this.$store.getters.colors;
    },
  },
  watch: {
    colors(colors) {
      if (colors?.length > 0) setLights(colors);
    },
  },
};
</script>
<style>
</style>