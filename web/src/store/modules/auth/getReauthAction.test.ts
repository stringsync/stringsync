import { getReauthAction } from './getReauthAction';
import { getTestStore } from '../../../testing';
import { AuthUser } from './types';

it('reauths the user', async () => {
  const { store, apollo } = getTestStore();
  const user: AuthUser = {
    id: 'id',
    username: 'username',
    email: 'email',
    role: 'teacher',
  };
  jest.spyOn(apollo, 'mutate').mockResolvedValue({
    data: { reauth: { user } },
  });

  await getReauthAction()(store.dispatch, store.getState, { apollo });

  const { auth } = store.getState();
  expect(auth.user).toEqual(user);
  expect(auth.isLoggedIn).toBe(true);
  expect(auth.isPending).toBe(false);
});
