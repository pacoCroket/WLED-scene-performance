<template>
  <div class="devices-grouping">
    <span> WLED Finder</span>

    <div class="wled-device-list">
      <div class="button-wrapper">
        <button
          @click="findWled()"
          :class="{ loading: isSearching }"
          class="btn"
        >
          Scan
        </button>
        <span class="ip-input"
          >IP: <input type="text" v-model="localIp"
        /></span>
      </div>
      <WledDevice
        v-for="(wledDevice, key, index) in wledDevices"
        :data="wledDevice"
        :key="key"
        :index="index"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import WledDevice from "./WledDevice";

export default {
  name: "WledFinder",
  components: {
    WledDevice,
  },
  data() {
    return {
      wledDevices: {},
      localIp: "192.168.0.1",
      isSearching: false,
    };
  },
  created() {
    this.findWled();
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
              // console.debug(err);
            })
            .finally(() => {
              donePromises++;
              if (donePromises >= 253) {
                this.isSearching = false;
              }
            });
        } catch (err) {
          // Do nothing
          // console.debug(err);
        }
      }
    },
  },
};
</script>

<style>
.button-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>