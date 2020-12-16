import { randStr } from './randStr';

describe('randStr', () => {
  it('returns a string of a given length', () => {
    expect(randStr(8)).toHaveLength(8);
  });

  it('is not deterministic', () => {
    expect(randStr(8)).not.toBe(randStr(8));
  });
});
