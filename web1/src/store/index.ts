import Vue from 'vue';
import Vuex from 'vuex';
import { ui, UiState } from './ui';
import { session, SessionState } from './session';

Vue.use(Vuex);

export interface RootState {}

export const store = new Vuex.Store<RootState>({
  modules: {
    ui,
    session,
  },
});
