import { compose } from './compose';

it('reduces the args', () => {
  const r1 = Symbol();
  const r2 = Symbol();
  const r3 = Symbol();
  const arg = Symbol();

  const f1 = jest.fn().mockReturnValue(r1);
  const f2 = jest.fn().mockReturnValue(r2);
  const f3 = jest.fn().mockReturnValue(r3);

  const r = compose(f1, f2, f3)(arg);

  expect(r).toBe(r1);
  expect(f1).toBeCalledWith(r2);
  expect(f2).toBeCalledWith(r3);
  expect(f3).toBeCalledWith(arg);
});
