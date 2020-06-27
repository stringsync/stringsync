import { randInt } from './randInt';

it('returns a random integer between min and max', () => {
  const min = 0;
  const max = 10;

  const int = randInt(min, max);

  expect(int).toBeGreaterThanOrEqual(min);
  expect(int).toBeLessThanOrEqual(max);
});
