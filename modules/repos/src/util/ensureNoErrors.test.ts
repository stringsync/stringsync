import { ensureNoErrors } from './ensureNoErrors';

it('does not throw an error for a non error object', () => {
  expect(() => ensureNoErrors({})).not.toThrow();
});

it('does not throw for an empty array', () => {
  expect(() => ensureNoErrors([])).not.toThrow();
});

it('does not throw for an non empty array without errors', () => {
  expect(() => ensureNoErrors([1, 2, 3])).not.toThrow();
});

it('throws for an error instance', () => {
  expect(() => ensureNoErrors(new Error())).toThrow();
});

it('throws for an array with at least one error', () => {
  expect(() => ensureNoErrors([{}, {}, new Error()])).toThrow();
});
