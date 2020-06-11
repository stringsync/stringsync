import { authSuccess } from './authSuccess';
import { AUTH_SUCCESS } from './constants';
import { AuthUser } from './types';
import { UserRole } from '@stringsync/domain';

it('creates AUTH_SUCCESS actions', () => {
  const user: AuthUser = {
    id: 0,
    email: 'email',
    role: UserRole.ADMIN,
    username: 'username',
    confirmedAt: new Date(),
  };

  const action = authSuccess(user);

  expect(action.type).toBe(AUTH_SUCCESS);
  expect(action.payload.user).toEqual(user);
});
