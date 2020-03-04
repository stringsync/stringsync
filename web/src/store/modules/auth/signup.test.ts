import { signup } from './signup';
import { getTestStore } from '../../../testing';
import { AuthUser } from './types';

const USER: AuthUser = {
  id: 'id',
  username: 'username',
  email: 'email',
  role: 'teacher',
};

it('signs up the user', async () => {
  const { store, client, thunkArgs } = getTestStore();
  jest.spyOn(client, 'call').mockResolvedValue({ user: USER });

  await signup({
    email: 'email',
    password: 'password',
    username: 'username',
  })(...thunkArgs);

  const { auth } = store.getState();
  expect(auth.errors).toHaveLength(0);
  expect(auth.isLoggedIn).toBe(true);
  expect(auth.isPending).toBe(false);
  expect(auth.user).toEqual(USER);
});
