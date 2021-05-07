const state = {
  colors: [],
};

const getters = {
  colors: (state) => state.colors,
};

const actions = {};

const mutations = {
  setColors(colors) {
    state.colors = colors;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
