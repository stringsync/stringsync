import { gql, ApolloError } from 'apollo-boost';
import { ThunkAction } from '../..';
import { pick } from 'lodash';

export const AUTH_JWT_KEY = 'ss:auth:jwt';
export const AUTH_USER_KEY = 'ss:auth:user';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export interface AuthState {
  isPending: boolean;
  user: AuthUser;
  isLoggedIn: boolean;
  jwt: string;
  errors: string[];
}

export const REQUEST_AUTH_PENDING = 'auth/REQUEST_AUTH_PENDING';
interface RequestAuthPendingAction {
  type: typeof REQUEST_AUTH_PENDING;
}
export const requestAuthPending = (): RequestAuthPendingAction => ({
  type: REQUEST_AUTH_PENDING,
});

export const REQUEST_AUTH_SUCCESS = 'auth/REQUEST_AUTH_SUCCESS';
interface RequestAuthSuccessPayload {
  user: AuthUser;
  jwt: string;
}
interface RequestAuthSuccessAction {
  type: typeof REQUEST_AUTH_SUCCESS;
  payload: RequestAuthSuccessPayload;
}
export const requestAuthSuccess = (
  user: AuthUser,
  jwt: string
): RequestAuthSuccessAction => ({
  type: REQUEST_AUTH_SUCCESS,
  payload: { user, jwt },
});

export const REQUEST_AUTH_FAILURE = 'auth/REQUEST_AUTH_FAILURE';
interface RequestAuthFailurePayload {
  errors: string[];
}
interface RequestAuthFailureAction {
  type: typeof REQUEST_AUTH_FAILURE;
  payload: RequestAuthFailurePayload;
}
export const requestAuthFailure = (
  errors: string[]
): RequestAuthFailureAction => ({
  type: REQUEST_AUTH_FAILURE,
  payload: { errors },
});

export const CLEAR_AUTH_ERRORS = 'auth/CLEAR_AUTH_ERRORS';
interface ClearAuthErrorsAction {
  type: typeof CLEAR_AUTH_ERRORS;
}
export const clearAuthErrors = (): ClearAuthErrorsAction => ({
  type: CLEAR_AUTH_ERRORS,
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

export const signup = (
  input: SignupInput
): ThunkAction<void, AuthActionTypes> => async (dispatch, getState, ctx) => {
  dispatch(requestAuthPending());

  try {
    const res = await ctx.apollo.mutate<SignupData>({
      mutation: SIGNUP_MUTATION,
      variables: {
        input,
      },
    });
    if (!res.data) {
      throw new Error('no data returned from the server');
    }
    const data = res.data.signup;
    const jwt = data.jwt;
    const user = pick(data.user, ['id', 'username', 'email']);

    dispatch(requestAuthSuccess(user, jwt));

    window.localStorage.setItem(AUTH_JWT_KEY, jwt);
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch (error) {
    dispatch(requestAuthFailure(error.message));
  }
};

export type AuthActionTypes =
  | RequestAuthPendingAction
  | RequestAuthSuccessAction
  | RequestAuthFailureAction
  | ClearAuthErrorsAction;
