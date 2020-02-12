import { getAuthenticateAction } from './getAuthenticateAction';
import { getTestStore } from '../../../testing';
import { AuthUser } from './types';

it('authenticates the user', async () => {
  const { store, apollo } = getTestStore();
  const xsrfToken = 'xsrfToken';
  const user: AuthUser = {
    id: 'id',
    username: 'username',
    email: 'email',
    role: 'teacher',
  };
  jest.spyOn(apollo, 'mutate').mockResolvedValue({
    data: { authenticate: { xsrfToken, user } },
  });

  await getAuthenticateAction()(store.dispatch, store.getState, { apollo });

  const { auth } = store.getState();
  expect(auth.user).toEqual(user);
  expect(auth.isLoggedIn).toBe(true);
  expect(auth.isPending).toBe(false);
});
