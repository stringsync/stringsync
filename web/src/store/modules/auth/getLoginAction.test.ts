import { getLoginAction } from './getLoginAction';
import { getTestStore } from '../../../testing';
import { AuthUser } from './types';

const USER: AuthUser = {
  id: 'id',
  username: 'username',
  email: 'email',
  role: 'teacher',
};

it('logs the user in', async () => {
  const { store, client } = getTestStore();
  jest.spyOn(client, 'call').mockResolvedValue({ user: USER });

  await getLoginAction({
    emailOrUsername: 'emailOrUsername',
    password: 'password',
  })(store.dispatch, store.getState, { client });

  const { auth } = store.getState();
  expect(auth.isLoggedIn).toBe(true);
  expect(auth.isPending).toBe(false);
  expect(auth.errors).toHaveLength(0);
  expect(auth.user).toEqual(USER);
});
