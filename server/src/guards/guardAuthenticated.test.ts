import { guardAuthenticated } from './guardAuthenticated';
import { ReqCtx } from '../ctx';

it('throws an error when not logged in', () => {
  const ctx = {
    auth: {
      isLoggedIn: false,
    },
  } as ReqCtx;

  expect(() => guardAuthenticated(ctx)).toThrow();
});

it('does not throw an error when logged in', () => {
  const ctx = {
    auth: {
      isLoggedIn: true,
    },
  } as ReqCtx;

  expect(() => guardAuthenticated(ctx)).not.toThrow();
});
