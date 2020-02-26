import { getAuthenticateAction } from './getAuthenticateAction';
import { getTestStore } from '../../../testing';
import { AuthUser } from './types';

it('authenticates the user', async () => {
  const { store, client } = getTestStore();
  const user: AuthUser = {
    id: 'id',
    username: 'username',
    email: 'email',
    role: 'teacher',
  };
  jest.spyOn(client, 'call').mockResolvedValue(user);

  await getAuthenticateAction()(store.dispatch, store.getState, { client });

  const { auth } = store.getState();
  expect(auth.user).toEqual(user);
  expect(auth.isLoggedIn).toBe(true);
  expect(auth.isPending).toBe(false);
});
