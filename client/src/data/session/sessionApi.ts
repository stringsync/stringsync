import { SessionActions } from './sessionActions';
import { Dispatch } from 'react-redux';
import { OAuthProviders } from 'j-toker';

export const login = (user: User.ILoginUser) => async (dispatch: Dispatch) => {
  const response = await window.ss.auth.emailSignIn(user);
  dispatch(SessionActions.setSession(response.data));
}

export const signup = (user: User.ISignupUser) => async (dispatch: Dispatch) => {
  const response = await window.ss.auth.emailSignUp(user);
  dispatch(SessionActions.setSession(response.data));
};

export const oAuthLogin = (provider: OAuthProviders) => async (dispatch: Dispatch) => {
  const response = await window.ss.auth.oAuthSignIn({ provider });
  dispatch(SessionActions.setSession(response.data));
};

export const logout = () => async (dispatch: Dispatch) => {
  await window.ss.auth.signOut();
  dispatch(SessionActions.resetSession());
};
