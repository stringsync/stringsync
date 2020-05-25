import { withErrorHandler } from './withErrorHandler';
import { Provider } from '../../testing';
import { Middleware } from './types';
import { compose } from '../../common';

it('handles errors thrown downstream', async () => {
  const error = new Error();
  const resolver = jest.fn().mockImplementation(() => {
    throw error;
  });
  const errorHandler = jest.fn();
  const middleware = withErrorHandler(errorHandler);
  const newResolver = middleware(resolver);

  await Provider.run({}, async (p) => {
    const { src, args, rctx, info } = p;

    await expect(newResolver(src, args, rctx, info)).resolves.not.toThrow();

    expect(resolver).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalledWith(error);
  });
});

it('ignores errors thrown upstream', async () => {
  const upstreamMiddleware: Middleware = (next) =>
    jest.fn().mockImplementation(async () => {
      throw new Error();
    });
  const resolver = jest.fn();
  const errorHandler = jest.fn();
  const downstreamMiddleware = withErrorHandler(errorHandler);
  const middleware = compose(upstreamMiddleware, downstreamMiddleware);
  const newResolver = middleware(resolver);

  await Provider.run({}, async (p) => {
    const { src, args, rctx, info } = p;

    await expect(newResolver(src, args, rctx, info)).rejects.toThrow();

    expect(resolver).not.toHaveBeenCalled();
    expect(errorHandler).not.toHaveBeenCalled();
  });
});
