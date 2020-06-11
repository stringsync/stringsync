import { logout } from './logout';
import { getTestStore } from '../../testing';
import { AuthUser } from './types';
import { getNullAuthState } from './getNullAuthState';
import { UserRole } from '@stringsync/domain';

const USER: AuthUser = {
  id: 123,
  username: 'username',
  email: 'email',
  role: UserRole.TEACHER,
  confirmedAt: new Date(),
};

const NULL_USER = getNullAuthState().user;

it('logs the user out', async () => {
  const { store, thunkArgs } = getTestStore({
    auth: {
      isLoggedIn: true,
      user: USER,
      errors: ['error1'],
    },
  });
  // jest.spyOn(client, 'call').mockResolvedValue({});

  await logout()(...thunkArgs);

  const { auth } = store.getState();
  expect(auth.isLoggedIn).toBe(false);
  expect(auth.user).toEqual(NULL_USER);
  expect(auth.errors).toHaveLength(0);
});
