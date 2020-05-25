import { withTransaction } from './withTransaction';
import { Provider } from '../../testing';

it('wraps the resolver in a transaction', async () => {
  const resolver = jest.fn();
  const newResolver = withTransaction(resolver);

  await Provider.run({}, async (p) => {
    const { src, args, rctx, info } = p;
    const transactionSpy = jest.spyOn(rctx.db, 'transaction');

    await newResolver(src, args, rctx, info);

    expect(transactionSpy).toHaveBeenCalled();
    expect(resolver).toHaveBeenCalled();
  });
});
