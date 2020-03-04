import { authenticate } from './authenticate';
import { getTestStore } from '../../../testing';
import { AuthUser } from './types';

it('authenticates the user', async () => {
  const { store, client, thunkArgs } = getTestStore();
  const user: AuthUser = {
    id: 'id',
    username: 'username',
    email: 'email',
    role: 'teacher',
  };
  jest.spyOn(client, 'call').mockResolvedValue({ user });

  await authenticate()(...thunkArgs);

  const { auth } = store.getState();
  expect(auth.user).toEqual(user);
  expect(auth.isLoggedIn).toBe(true);
  expect(auth.isPending).toBe(false);
});
