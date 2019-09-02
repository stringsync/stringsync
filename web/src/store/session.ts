import { Module } from 'vuex';
import { RootState } from './';
import { login, signup } from './session.queries';

export interface SessionState {
  isLoggedIn: boolean;
}

const USER_JWT = 'USER_JWT';

export const session: Module<SessionState, RootState> = {
  namespaced: true,
  state() {
    return {
      isLoggedIn: Boolean(localStorage.getItem(USER_JWT)),
    };
  },
  getters: {},
  mutations: {
    setIsLoggedIn(state, { isLoggedIn }) {
      state.isLoggedIn = isLoggedIn;
    },
  },
  actions: {
    logout(ctx) {
      localStorage.removeItem(USER_JWT);
      ctx.commit('setIsLoggedIn', { isLoggedIn: false });
    },
    async login(ctx, { username, password }) {
      const userInput = { username, password };
      const data = await login({ userInput });
      const user = data.login;
      localStorage.setItem(USER_JWT, user.token);
      ctx.commit('setIsLoggedIn', { isLoggedIn: true });
    },
    async signup(ctx, { username, password }) {
      const userInput = { username, password };
      const data = await signup({ userInput });
      const user = data.signup;
      localStorage.setItem(USER_JWT, user.token);
      ctx.commit('setIsLoggedIn', { isLoggedIn: true });
    },
  },
};
