import { identity } from './identity';

it('returns the argument', () => {
  const expected = Symbol();
  const actual = identity(expected);
  expect(actual).toBe(expected);
});
