import { getNullAuthState } from './getNullAuthState';

it('runs without crashing', () => {
  expect(getNullAuthState).not.toThrow();
});
