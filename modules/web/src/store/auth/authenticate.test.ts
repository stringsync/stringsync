import { authenticate } from './authenticate';
import { getTestStore } from '../../testing';
import { AuthUser } from './types';
import { UserRole } from '@stringsync/domain';

it('authenticates the user', async () => {
  const { store, thunkArgs } = getTestStore();
  const user: AuthUser = {
    id: 123,
    username: 'username',
    email: 'email',
    role: UserRole.TEACHER,
    confirmedAt: new Date(),
  };
  // jest.spyOn(client, 'call').mockResolvedValue({ user });

  await authenticate()(...thunkArgs);

  const { auth } = store.getState();
  expect(auth.user).toEqual(user);
  expect(auth.isLoggedIn).toBe(true);
  expect(auth.isPending).toBe(false);
});
