import { getNullAuthState } from './getNullAuthState';

describe('getNullAuthState', () => {
  it('runs without crashing', () => {
    expect(getNullAuthState).not.toThrow();
  });
});
