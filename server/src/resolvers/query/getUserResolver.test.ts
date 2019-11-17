import { getUserResolver } from './getUserResolver';
import { GetUserInput } from 'common/types';
import { getTestCtxProvider } from '../../testing';

const provideTestCtx = getTestCtxProvider();

it(
  'loads the user from the dataLoader',
  provideTestCtx({}, async (ctx) => {
    const mockLoad = jest
      .fn()
      .mockImplementationOnce((key: string) => Symbol.for(key));
    ctx.dataLoaders.usersById.load = mockLoad;

    const input: GetUserInput = { id: 'fake-id' };
    const user = await getUserResolver(undefined, { input }, ctx);

    expect(mockLoad).toBeCalledTimes(1);
    expect(user).toBe(Symbol.for('fake-id'));
  })
);
