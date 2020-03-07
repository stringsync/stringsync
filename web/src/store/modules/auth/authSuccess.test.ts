import { authSuccess } from './authSuccess';
import { AUTH_SUCCESS } from './constants';
import { AuthUser } from './types';

it('creates AUTH_SUCCESS actions', () => {
  const user: AuthUser = {
    id: 'id',
    email: 'email',
    role: 'admin',
    username: 'username',
    confirmedAt: new Date(),
  };

  const action = authSuccess(user);

  expect(action.type).toBe(AUTH_SUCCESS);
  expect(action.payload.user).toEqual(user);
});
