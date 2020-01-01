import { getReauthAction, REAUTH_MUTATION } from './getReauthAction';
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
  jest.spyOn(apollo, 'mutate').mockResolvedValue({
    data: { reauth: { user } },
  });

  await getReauthAction()(store.dispatch, store.getState, { apollo });

  const { auth } = store.getState();
  expect(auth.user).toEqual(user);
  expect(auth.isLoggedIn).toBe(true);
  expect(auth.isPending).toBe(false);
});

it('mutates reauth', async () => {
  const { store, apollo } = getTestStore();
  jest.spyOn(apollo, 'mutate').mockResolvedValue({});

  await getReauthAction()(store.dispatch, store.getState, { apollo });

  expect(apollo.mutate).toHaveBeenCalledWith({
    mutation: REAUTH_MUTATION,
  });
});

it('dispatches an auth pending action', async () => {
  const { store, apollo } = getTestStore();
  const dispatchSpy = jest.spyOn(store, 'dispatch');
  jest.spyOn(apollo, 'mutate').mockResolvedValue({});

  await getReauthAction()(store.dispatch, store.getState, { apollo });

  expect(dispatchSpy).toHaveBeenCalledWith({
    type: REQUEST_AUTH_PENDING,
  });
});
