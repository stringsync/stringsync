import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    msg: 'Hello, from the store!',
  },
  mutations: {},
  actions: {},
  getters: {
    msg(state) {
      return state.msg;
    },
  },
});
