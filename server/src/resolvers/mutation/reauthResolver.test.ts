import { reauthResolver } from './reauthResolver';
import { getTestCtxProvider } from '../../testing';

const provideTestCtx = getTestCtxProvider();

it(
  'throws an error when not logged in',
  provideTestCtx({}, async (ctx) => {
    ctx.auth.isLoggedIn = false;
    await expect(reauthResolver(undefined, {}, ctx)).rejects.toThrowError(
      'invalid or expired credentials'
    );
  })
);

it(
  'throws an error when no user',
  provideTestCtx({}, async (ctx) => {
    ctx.auth.user = null;
    await expect(reauthResolver(undefined, {}, ctx)).rejects.toThrowError(
      'invalid or expired credentials'
    );
  })
);

it(
  'throws an error when no token',
  provideTestCtx({}, async (ctx) => {
    ctx.auth.token = '';
    await expect(reauthResolver(undefined, {}, ctx)).rejects.toThrowError(
      'invalid or expired credentials'
    );
  })
);
