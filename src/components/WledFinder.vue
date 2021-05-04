<template>
  <div>
    WLED Finder
    <button
      @click="findWled()"
      v-bind:class="{ loading: isSearching }"
      class="btn"
    >
      Scan
    </button>
    <div id="v-for-object" class="demo">
      <div v-for="wledDevice in wledDevices" v-bind:key="wledDevice.ip">
        <a v-bind:href="'http://' + wledDevice.ip" target="_blank">{{
          wledDevice.ip
        }}</a>
        <span>{{ wledDevice.name }} </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "WledFinder",
  data() {
    return {
      wledDevices: {},
      localIp: "192.168.0.1",
      isSearching: false,
    };
  },
  methods: {
    findWled() {
      console.log("finding Wled devices");
      this.isSearching = true;
      let donePromises = 0; // from 2 to 254 as in the loop
      // range is [0-255] but 0 and 255 are reserved
      for (var i = 2; i < 255; i++) {
        try {
          const ipArray = this.localIp.split(".");
          ipArray.splice(3, 1);
          ipArray.push(i);
          const ip = ipArray.join(".");

          const promise = axios("http://" + ip + "/json/info", {
            timeout: 5000,
          });

          // we check the result immediately anyway
          promise
            .then((res) => {
              if (res.statusText === "OK") {
                const body = res.data;
                this.wledDevices = {
                  ...this.wledDevices,
                  [ip]: { ip, ...body },
                };
                // dispatch(setWledDevice({ ...body, ip, controlGroupId: null })); //  TODO util to construct a new wled device
                console.log(ip, "success");
              }
            })
            .catch((err) => {
              // Do nothing
              console.debug(err);
            })
            .finally(() => {
              donePromises++;
              if (donePromises >= 253) {
                this.isSearching = false;
              }
            });
        } catch (err) {
          // Do nothing
          console.debug(err);
        }
      }
    },
  },
};
</script>

<style>
</style>