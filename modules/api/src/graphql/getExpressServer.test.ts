import { getExpressServer } from './getExpressServer';

describe('getExpressServer', () => {
  it('runs without crashing', () => {
    expect(getExpressServer).not.toThrow();
  });
});
