import { guardAuthenticated } from './guardAuthenticated';
import { RequestContext } from '../request-context';

it('throws an error when not logged in', () => {
  const ctx = {
    auth: {
      isLoggedIn: false,
    },
  } as RequestContext;

  expect(() => guardAuthenticated(ctx)).toThrow();
});

it('does not throw an error when logged in', () => {
  const ctx = {
    auth: {
      isLoggedIn: true,
    },
  } as RequestContext;

  expect(() => guardAuthenticated(ctx)).not.toThrow();
});
