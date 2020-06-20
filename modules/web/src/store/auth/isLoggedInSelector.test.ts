import { createStore } from './../createStore';
import { isLoggedInSelector } from './isLoggedInSelector';
import { AppStore } from '../types';

let store: AppStore;

beforeEach(() => {
  store = createStore();
});

it('returns the isLoggedIn state', () => {
  const state = store.getState();
  const isLoggedIn = isLoggedInSelector(state);
  expect(isLoggedIn).toBe(false);
});

it('returns the isLoggedIn state', () => {
  const state = store.getState();
  state.auth.user.id = 1;
  const isLoggedIn = isLoggedInSelector(state);
  expect(isLoggedIn).toBe(true);
});
