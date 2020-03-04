import { authPending } from './authPending';
import { AUTH_PENDING } from './constants';

it('creates AUTH_PENDING actions', () => {
  const action = authPending();

  expect(action.type).toBe(AUTH_PENDING);
});
