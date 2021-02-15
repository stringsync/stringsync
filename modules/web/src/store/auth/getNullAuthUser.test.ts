import { getNullAuthUser } from './getNullAuthUser';

describe('getNullAuthUser', () => {
  it('runs without crashing', () => {
    expect(getNullAuthUser).not.toThrow();
  });
});
