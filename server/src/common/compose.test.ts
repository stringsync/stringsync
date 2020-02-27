import { compose } from './compose';

it('reduces the functions from left-to-right', () => {
  const a = jest.fn().mockReturnValue('a');
  const b = jest.fn().mockReturnValue('b');
  const c = jest.fn().mockReturnValue('c');

  const composed = compose(a, b, c);
  const result = composed();

  expect(result).toBe('a');
  expect(a).toHaveBeenCalledWith('b');
  expect(b).toHaveBeenCalledWith('c');
  expect(a).toHaveBeenCalledTimes(1);
  expect(b).toHaveBeenCalledTimes(1);
  expect(c).toHaveBeenCalledTimes(1);
});
