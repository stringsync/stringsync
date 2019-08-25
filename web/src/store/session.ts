import { Module } from 'vuex';
import { RootState } from './'

export interface SessionState {
  isLoggedIn: boolean;
}

export const session: Module<SessionState, RootState> = {
  state() {
    return {
      isLoggedIn: false,
    };
  },
  getters: {
    isLoggedIn(state) {
      return state.isLoggedIn;
    }
  },
  mutations: {
    setIsLoggedIn(state, { isLoggedIn }) {
      state.isLoggedIn = isLoggedIn;
    }
  },
  actions: {
    setIsLoggedIn(ctx, { isLoggedIn }) {
      ctx.commit('setIsLoggedIn', { isLoggedIn });
    }
  },
};
