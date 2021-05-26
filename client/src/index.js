import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/index";

const app = createApp(App);
app.use(store);
app.mount("#app");

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    app.unmount();
  });
}
