<template>
  <div class="wled-device">
    <span class="name">{{ data.name }} </span>
    <a class="ip-link" v-bind:href="'http://' + data.ip" target="_blank">{{
      data.ip
    }}</a>
    <div class="led-colors">
      <span
        v-for="(color, index) in this.colors"
        :key="index"
        :style="{ backgroundColor: color }"
        class="color"
      ></span>
    </div>
  </div>
</template>

<script>
// import { mapMutations } from "vuex";
export default {
  name: "WledDevice",
  props: {
    data: Object,
    // index: Number,
  },
  data() {
    return {
      connection: null,
      colors: [],
    };
  },
  created() {
    this.connection = new WebSocket("ws://" + this.data.ip + "/ws");

    this.connection.onmessage = (event) => {
      this.colors = JSON.parse(event.data).leds?.map((it) => "#" + it);
    };

    this.connection.onopen = () => {
      this.connection.send(JSON.stringify({ lv: true }));
    };
  },
  // methods: {
  //   ...mapMutations(["setColors"]),
  // },
  // watch: {
  //   colors: (colors) => this.index === 0 && setColors(colors), // only the first device sets the colors
  // },
};
</script>

<style>
</style>