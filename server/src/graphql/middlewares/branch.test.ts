import { branch } from './branch';
import { Provider } from '../../testing';

it('calls left resolver when test returns true', () => {
  const test = jest.fn().mockReturnValue(true);
  const resolver = jest.fn();
  const left = jest.fn().mockReturnValue(resolver);
  const right = jest.fn().mockReturnValue(resolver);

  return Provider.run({}, async (p) => {
    const { src, args, rctx, info } = p;
    const middleware = branch(test, left, right);
    const wrapped = middleware(resolver);

    await wrapped(src, args, rctx, info);

    expect(left).toHaveBeenCalled();
    expect(right).not.toHaveBeenCalled();
  });
});

it('calls right resolver when test returns false', () => {
  const test = jest.fn().mockReturnValue(false);
  const resolver = jest.fn();
  const left = jest.fn().mockReturnValue(resolver);
  const right = jest.fn().mockReturnValue(resolver);

  return Provider.run({}, async (p) => {
    const { src, args, rctx, info } = p;
    const middleware = branch(test, left, right);
    const wrapped = middleware(resolver);

    await wrapped(src, args, rctx, info);

    expect(left).not.toHaveBeenCalled();
    expect(right).toHaveBeenCalled();
  });
});
