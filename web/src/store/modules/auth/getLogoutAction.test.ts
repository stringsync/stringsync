import { getLogoutAction, LOGOUT_MUTATION } from './getLogoutAction';
import { getTestStore } from '../../../testing';
import { CLEAR_AUTH } from './constants';

it('dispatches a CLEAR_AUTH action', async () => {
  const { store, apollo } = getTestStore();
  const dispatchSpy = jest.spyOn(store, 'dispatch');
  jest.spyOn(apollo, 'mutate').mockResolvedValue({});

  await getLogoutAction()(store.dispatch, store.getState, { apollo });

  expect(dispatchSpy).toHaveBeenCalledWith({
    type: CLEAR_AUTH,
  });
});

it('mutates logout', async () => {
  const { store, apollo } = getTestStore();
  jest.spyOn(apollo, 'mutate').mockResolvedValue({});

  await getLogoutAction()(store.dispatch, store.getState, { apollo });

  expect(apollo.mutate).toHaveBeenCalledWith({
    mutation: LOGOUT_MUTATION,
  });
});
