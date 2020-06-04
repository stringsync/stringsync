import { noop } from './noop';

it('does nothing', () => {
  expect(noop).not.toThrow();
});

it('can accept any arguments', () => {
  expect(() => noop(1, 'asdf', Symbol('foo'))).not.toThrow();
});

it('returns undefined', () => {
  expect(noop()).toBeUndefined();
});
