import { getInitialAuthState } from './getInitialAuthState';

it('runs without crashing', () => {
  expect(() => getInitialAuthState()).not.toThrow();
});
