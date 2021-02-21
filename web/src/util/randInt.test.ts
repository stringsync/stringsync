import { randInt } from './randInt';

describe('randInt', () => {
  it('returns a random integer between min and max', () => {
    const min = 0;
    const max = 10;

    const int = randInt(min, max);

    expect(int).toBeGreaterThanOrEqual(min);
    expect(int).toBeLessThanOrEqual(max);
  });

  it('throws an error when min is greater than max', () => {
    const min = 10;
    const max = 0;

    expect(() => randInt(min, max)).toThrow();
  });
});
