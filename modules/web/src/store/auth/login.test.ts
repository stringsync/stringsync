import { login } from './login';
import { getTestStore } from '../../testing';
import { AuthUser } from './types';
import { UserRole } from '@stringsync/domain';

const USER: AuthUser = {
  id: 123,
  username: 'username',
  email: 'email',
  role: UserRole.TEACHER,
  confirmedAt: new Date(),
};

it('logs the user in', async () => {
  const { store, thunkArgs } = getTestStore();
  // jest.spyOn(client, 'call').mockResolvedValue({ user: USER });

  await login({
    input: {
      emailOrUsername: 'emailOrUsername',
      password: 'password',
    },
  })(...thunkArgs);

  const { auth } = store.getState();
  expect(auth.isLoggedIn).toBe(true);
  expect(auth.isPending).toBe(false);
  expect(auth.errors).toHaveLength(0);
  expect(auth.user).toEqual(USER);
});
