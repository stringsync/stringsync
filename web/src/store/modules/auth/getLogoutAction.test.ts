import { getLogoutAction } from './getLogoutAction';
import { getTestStore } from '../../../testing';
import { AuthUser } from './types';
import { getNullAuthState } from './getNullAuthState';

const USER: AuthUser = {
  id: 'id',
  username: 'username',
  email: 'email',
  role: 'teacher',
};

const NULL_USER = getNullAuthState().user;

it('logs the user out', async () => {
  const { store, apollo } = getTestStore({
    auth: {
      isLoggedIn: true,
      user: USER,
      errors: ['error1'],
    },
  });
  jest.spyOn(apollo, 'mutate').mockResolvedValue({});

  await getLogoutAction()(store.dispatch, store.getState, { apollo });

  const { auth } = store.getState();
  expect(auth.isLoggedIn).toBe(false);
  expect(auth.user).toEqual(NULL_USER);
  expect(auth.errors).toHaveLength(0);
});
