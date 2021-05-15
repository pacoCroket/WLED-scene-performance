<template>
  <div class="wled-device">
    <div class="name">
      <span>{{ data.name }}</span>
      <span class="sync-on" v-if="data.udpn?.send"> [M]</span>
    </div>

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
    foundTime: Date,
  },
  data() {
    return {
      connection: null,
      colors: [],
    };
  },
  mounted() {
    this.openWebsocket();
  },
  methods: {
    ...mapMutations(["setColors"]),
    openWebsocket() {
      this.connection = new WebSocket("ws://" + this.data.ip + "/ws");

      this.connection.onmessage = (event) => {
        try {
          this.colors = JSON.parse(event.data).leds?.map((it) => "#" + it);
        } catch (err) {
          console.log(err);
        }
      };

      this.connection.onopen = () => {
        this.connection.send(JSON.stringify({ lv: true }));
      };
    },
  },
  watch: {
    colors: function (colors) {
      this.index === 0 && this.$store.commit("setColors", colors);
    }, // only the first device sets the colors
    foundTime: function () {
      if (this.connection) {
        this.connection.close();
      }
      this.openWebsocket();
    },
  },
};
</script>

<style>
</style>