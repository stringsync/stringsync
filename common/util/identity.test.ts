import { identity } from './identity';

it('returns the same object', () => {
  const symbol = Symbol('foo');
  const result = identity(symbol);
  expect(result).toBe(symbol);
});
