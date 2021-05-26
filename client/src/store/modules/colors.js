const state = {
  colors: [],
};

const getters = {
  colors: (state) => {
    return state.colors;
  },
};

const actions = {};

const mutations = {
  setColors(state, colors) {
    state.colors = colors;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
