import { createStore } from "vuex";
import colors from "./modules/colors";

const store = createStore({
  modules: {
    colors,
  },
});

export default store;
