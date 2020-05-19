import { login } from './login';
import { getTestStore } from '../../testing';
import { AuthUser } from './types';

const USER: AuthUser = {
  id: 'id',
  username: 'username',
  email: 'email',
  role: 'teacher',
  confirmedAt: new Date(),
};

it('logs the user in', async () => {
  const { store, thunkArgs } = getTestStore();
  // jest.spyOn(client, 'call').mockResolvedValue({ user: USER });

  await login({
    emailOrUsername: 'emailOrUsername',
    password: 'password',
  })(...thunkArgs);

  const { auth } = store.getState();
  expect(auth.isLoggedIn).toBe(true);
  expect(auth.isPending).toBe(false);
  expect(auth.errors).toHaveLength(0);
  expect(auth.user).toEqual(USER);
});
