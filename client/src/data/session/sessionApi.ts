import { SessionActions } from './sessionActions';
import { Dispatch } from 'react-redux';
import { OAuthProviders, OAuthCallback, ISignupUser } from 'j-toker';

export const login = (user: User.ILoginUser) => async (dispatch: Dispatch) => {
  const response = await window.ss.auth.emailSignIn(user);
  dispatch(SessionActions.setSession(response.data));
  return response;
}

export const signup = (user: ISignupUser) => async (dispatch: Dispatch) => {
  const response = await window.ss.auth.emailSignUp(user);
  dispatch(SessionActions.setSession(response.data));
  return response;
};

export const oAuthLogin = (provider: OAuthProviders) => async (dispatch: Dispatch) => {
  const response = await window.ss.auth.oAuthSignIn({ provider });
  dispatch(SessionActions.setSession(response.data));
  return response;
};

export const logout = () => async (dispatch: Dispatch) => {
  await window.ss.auth.signOut();
  dispatch(SessionActions.resetSession());
  window.ss.sessionSync.user = {};
};
