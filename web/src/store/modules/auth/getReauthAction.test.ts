import { getReauthAction } from './getReauthAction';
import { getTestStore } from '../../../testing';
import { REQUEST_AUTH_PENDING } from './constants';
import { AuthUser } from './types';

it('sets the user from the response', async () => {
  const { store, apollo } = getTestStore();
  const user: AuthUser = {
    id: 'id',
    username: 'username',
    email: 'email',
    role: 'teacher',
  };
  jest.spyOn(apollo, 'mutate').mockImplementation(async () => ({
    data: { reauth: { user } },
  }));

  await getReauthAction()(store.dispatch, store.getState, { apollo });

  const { auth } = store.getState();
  expect(auth.user).toEqual(user);
  expect(auth.isLoggedIn).toBe(true);
  expect(auth.isPending).toBe(false);
});

it('dispatches an auth pending action', async () => {
  const { store, apollo } = getTestStore();
  const dispatchSpy = jest.spyOn(store, 'dispatch');
  jest.spyOn(apollo, 'mutate').mockImplementation(async () => undefined);

  await getReauthAction()(store.dispatch, store.getState, { apollo });

  expect(dispatchSpy).toHaveBeenCalledWith({
    type: REQUEST_AUTH_PENDING,
  });
});
