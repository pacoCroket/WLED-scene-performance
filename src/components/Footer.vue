<template >
  <div class="footer">
    <button class="btn" @click="handleCloudsBtn()">Clouds</button>
    <button class="btn" @click="handleLightsBtn()">Lights</button>
  </div>
</template>
<script>
import { generateClouds, generateLights } from "../cloudWebGL";

export default {
  name: "Footer",
  methods: {
    handleCloudsBtn() {
      generateClouds();
    },
    handleLightsBtn() {
      generateLights();
    },
  },
};
</script>
<style>
.footer {
  display: flex;
  justify-self: flex-start;
}

.footer > * {
  margin: 0.5rem;
}
</style>