import { getRequestAuthSuccessAction } from './getRequestAuthSuccessAction';
import { REQUEST_AUTH_SUCCESS } from './constants';
import { AuthUser } from './types';

it('creates REQUEST_AUTH_SUCCESS actions', () => {
  const user: AuthUser = {
    id: 'id',
    email: 'email',
    role: 'admin',
    username: 'username',
  };

  const action = getRequestAuthSuccessAction(user);

  expect(action.type).toBe(REQUEST_AUTH_SUCCESS);
  expect(action.payload.user).toEqual(user);
});
