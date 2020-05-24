import { branch } from './branch';
import { Provider } from '../../testing';
import { identity } from './identity';

it('calls left resolver when test returns true', () => {
  const test = jest.fn().mockReturnValue(true);
  const resolver = jest.fn();
  const left = jest.fn().mockImplementation(identity);
  const right = jest.fn().mockImplementation(identity);

  return Provider.run({}, async (p) => {
    const middleware = branch(test, left, right);
    const wrapped = middleware(resolver);

    await wrapped(undefined, {}, p.rctx, p.info);

    expect(left).toHaveBeenCalled();
    expect(right).not.toHaveBeenCalled();
  });
});
