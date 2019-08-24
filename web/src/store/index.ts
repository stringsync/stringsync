import Vue from 'vue';
import Vuex from 'vuex';
import { ui } from './ui';

Vue.use(Vuex);

export interface RootState {}

export default new Vuex.Store<RootState>({
  modules: {
    ui,
  },
});
