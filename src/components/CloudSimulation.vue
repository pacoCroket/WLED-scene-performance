<template>
  <div ref="cloudSimulation" class="cloud-simulation"></div>
</template>
<script>
import { initCloud } from "../cloudWebGL";

export default {
  name: "CloudSimulation",
  data() {
    return {
      threeNode: null,
    };
  },
  mounted() {
    const existingCanvas = this.$refs.cloudSimulation.querySelector("canvas");
    if (existingCanvas) this.$refs.cloudSimulation.removeChild(existingCanvas);
    this.threeNode = initCloud();
    this.$refs.cloudSimulation.appendChild(this.threeNode);
  },
};
</script>
<style>
.cloud-simulation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>