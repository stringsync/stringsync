import { gql, ApolloError } from 'apollo-boost';
import { ThunkAction } from '../..';
import { pick } from 'lodash';

// keys for localstorage
export const AUTH_JWT_KEY = 'ss:auth:jwt';
export const AUTH_USER_KEY = 'ss:auth:user';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export type AuthState = AuthUser & {
  isLoggedIn: boolean;
  jwt: string;
};

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

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}
export interface SignupData {
  signup: {
    jwt: string;
    user: {
      id: number;
      username: string;
      email: string;
    };
  };
}
export const SIGNUP_MUTATION = gql`
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
`;

export const createSignupAction = (
  input: SignupInput
): ThunkAction<void, AuthActionTypes> => async (dispatch, getState, ctx) => {
  // issue mutation request
  const res = await ctx.apollo.mutate<SignupData>({
    mutation: SIGNUP_MUTATION,
    variables: {
      input,
    },
  });

  if (!res.data) {
    throw new ApolloError({ errorMessage: 'no data returned from the server' });
  }

  // parse response
  const data = res.data.signup;
  const jwt = data.jwt;
  const user = pick(data.user, ['id', 'username', 'email']);

  // dispatch action to set auth in store
  dispatch(createSetAuthAction({ user, jwt }));
  window.localStorage.setItem(AUTH_JWT_KEY, jwt);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export type AuthActionTypes = SetAuthAction | ClearAuthAction;
