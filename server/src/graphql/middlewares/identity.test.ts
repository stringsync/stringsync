import { identity } from './identity';
import { Provider } from '../../testing';

it('calls the resolver unconditionally', () => {
  const resolver = jest.fn();

  Provider.run({}, async (p) => {
    const { rctx, info } = p;

    const wrapped = identity(resolver);
    expect(resolver).not.toHaveBeenCalled();

    wrapped(undefined, {}, rctx, info);
    expect(resolver).toHaveBeenCalled();
  });
});
