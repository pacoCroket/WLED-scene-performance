<template>
  <div class="wled-device">
    <span class="name">{{ data.name }}{{ data.udpn?.send ? " [M]" : "" }}</span>
    <!-- <span v-if="data.ws">[master]</span> -->
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
import { mapMutations } from "vuex";
export default {
  name: "WledDevice",
  props: {
    data: Object,
    index: Number,
  },
  data() {
    return {
      connection: null,
      colors: [],
    };
  },
  created() {
    try {
      this.connection = new WebSocket("ws://" + this.data.ip + "/ws");

      this.connection.onmessage = (event) => {
        this.colors = JSON.parse(event.data).leds?.map((it) => "#" + it);
      };

      this.connection.onopen = () => {
        this.connection.send(JSON.stringify({ lv: true }));
      };
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapMutations(["setColors"]),
  },
  watch: {
    colors: function (colors) {
      this.index === 0 && this.$store.commit("setColors", colors);
    }, // only the first device sets the colors
  },
};
</script>

<style>
</style>