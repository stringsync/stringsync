import { randStr } from './rand';

describe('randStr', () => {
  it.each([1, 10, 15, 16])('returns a string with given length', (length) => {
    const str = randStr(length);
    expect(str).toHaveLength(length);
  });
});
