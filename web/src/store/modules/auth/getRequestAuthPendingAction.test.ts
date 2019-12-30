import { getRequestAuthPendingAction } from './getRequestAuthPendingAction';
import { REQUEST_AUTH_PENDING } from './constants';

it('creates REQUEST_AUTH_PENDING actions', () => {
  const action = getRequestAuthPendingAction();

  expect(action.type).toBe(REQUEST_AUTH_PENDING);
});
