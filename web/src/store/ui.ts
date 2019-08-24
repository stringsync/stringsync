import { Module } from 'vuex';
import { RootState } from './';

export interface UiState {
  isAppNavOpened: boolean;
}

export const ui: Module<UiState, RootState> = {
  namespaced: true,
  state() {
    return {
      isAppNavOpened: false,
    };
  },
  getters: {
    isAppNavOpened(state) {
      return state.isAppNavOpened;
    },
  },
  mutations: {
    setIsAppNavOpened(state, payload) {
      state.isAppNavOpened = payload.isAppNavOpened;
    },
  },
  actions: {
    toggleIsAppNavOpened(ctx) {
      const isAppNavOpened = !ctx.getters.isAppNavOpened;
      ctx.commit('setIsAppNavOpened', { isAppNavOpened });
    },
    setIsAppNavOpened(ctx, { isAppNavOpened }) {
      ctx.commit('setIsAppNavOpened', { isAppNavOpened });
    },
  },
};
