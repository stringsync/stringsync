import { ThunkAction } from '../';
import { AuthActionTypes } from './types';
import { logout } from './logout';
import { authPending } from './authPending';

export const authenticate = (): ThunkAction<void, AuthActionTypes> => async (
  dispatch,
  getState,
  ctx
) => {
  dispatch(authPending());

  try {
    // const res = await ctx.client.call<AuthenticateData, undefined>(
    //   AUTHENTICATE_MUTATION
    // );
    // dispatch(authSuccess(res.user));
  } catch (error) {
    dispatch(logout());
  }
};
