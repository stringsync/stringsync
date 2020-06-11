import { signup } from './signup';
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

it('signs up the user', async () => {
  const { store, client, thunkArgs } = getTestStore();
  // jest.spyOn(client, 'hello').mockResolvedValue({ user: USER });

  await signup({
    input: {
      email: 'email',
      password: 'password',
      username: 'username',
    },
  })(...thunkArgs);

  const { auth } = store.getState();
  expect(auth.errors).toHaveLength(0);
  expect(auth.isLoggedIn).toBe(true);
  expect(auth.isPending).toBe(false);
  expect(auth.user).toEqual(USER);
});
