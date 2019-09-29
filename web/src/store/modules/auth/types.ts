import { ThunkAction } from '../..';
import { gql } from 'apollo-boost';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

// keys for localstorage
export const AUTH_JWT_KEY = 'ss:auth:jwt';
export const AUTH_USER_KEY = 'ss:auth:user';

export type AuthState = AuthUser & {
  isLoggedIn: boolean;
  jwt: string;
};

// can be used for signup, login, or refreshAuth workflows
export const SET_AUTH = 'SET_AUTH';
interface SetAuthPayload {
  user: AuthUser;
  jwt: string;
}
interface SetAuthAction {
  type: typeof SET_AUTH;
  payload: SetAuthPayload;
}
export const createSetAuthAction = (
  payload: SetAuthPayload
): SetAuthAction => ({
  type: SET_AUTH,
  payload,
});

export const CLEAR_AUTH = 'CLEAR_AUTH';
interface ClearAuthAction {
  type: typeof CLEAR_AUTH;
}
export const createClearAuthAction = (): ClearAuthAction => ({
  type: CLEAR_AUTH,
});

interface SignupInput {
  username: string;
  email: string;
  password: string;
}
export const createSignupAction = (
  input: SignupInput
): ThunkAction<void, AuthActionTypes> => async (dispatch, getState, ctx) => {
  // issue mutation request
  const res = await ctx.apollo.mutate({
    mutation: gql`
      mutation Signup($input: SignupInput!) {
        signup(input: $input) {
          jwt
          user {
            id
            username
            email
          }
        }
      }
    `,
    variables: {
      input,
    },
  });

  // parse response
  const jwt: string = res.data.signup.jwt;
  const userData = res.data.signup;
  const user: AuthUser = {
    id: userData.id,
    username: userData.username,
    email: userData.email,
  };

  // dispatch action to set auth in store
  dispatch(createSetAuthAction({ user, jwt }));
  window.localStorage.setItem(AUTH_JWT_KEY, jwt);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export type AuthActionTypes = SetAuthAction | ClearAuthAction;
