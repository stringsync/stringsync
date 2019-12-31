import { getReauthAction } from './getReauthAction';
import { getTestStore } from '../../../testing';
import { REQUEST_AUTH_PENDING } from './constants';

it('dispatches an auth pending action', () => {
  const { store, apollo } = getTestStore();
  const dispatchSpy = jest.spyOn(store, 'dispatch');
  const action = getReauthAction();

  action(store.dispatch, store.getState, { apollo });

  expect(dispatchSpy).toHaveBeenCalledTimes(1);
  expect(dispatchSpy).toHaveBeenCalledWith({
    type: REQUEST_AUTH_PENDING,
  });
});
