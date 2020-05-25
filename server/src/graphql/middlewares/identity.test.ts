import { identity } from './identity';
import { Provider } from '../../testing';

it('calls the resolver unconditionally', () => {
  const resolver = jest.fn();

  return Provider.run({}, async (p) => {
    const { src, args, rctx, info } = p;
    const newResolver = identity(resolver);

    newResolver(src, args, rctx, info);

    expect(resolver).toHaveBeenCalled();
  });
});
