import { gql } from 'apollo-boost';
import { ThunkAction } from '../..';
import { pick } from 'lodash';
import { message } from 'antd';
import getErrorMessages from './getErrorMessages';

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
}
interface RequestAuthSuccessAction {
  type: typeof REQUEST_AUTH_SUCCESS;
  payload: RequestAuthSuccessPayload;
}
export const requestAuthSuccess = (
  user: AuthUser
): RequestAuthSuccessAction => ({
  type: REQUEST_AUTH_SUCCESS,
  payload: { user },
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

export const CLEAR_AUTH = 'auth/CLEAR_AUTH';
interface ClearAuthAction {
  type: typeof CLEAR_AUTH;
}
export const clearAuth = (): ClearAuthAction => ({
  type: CLEAR_AUTH,
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
const SIGNUP_MUTATION = gql`
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

    dispatch(requestAuthSuccess(user));

    window.localStorage.setItem(AUTH_JWT_KEY, jwt);
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

    message.info(`logged in as @${user.username}`);
  } catch (error) {
    dispatch(requestAuthFailure(getErrorMessages(error)));
  }
};

export interface LoginInput {
  emailOrUsername: string;
  password: string;
}
export interface LoginData {
  login: {
    jwt: string;
    user: {
      id: number;
      username: string;
      email: string;
    };
  };
}
const LOGIN_QUERY = gql`
  query Login($input: LoginInput!) {
    login(input: $input) {
      jwt
      user {
        id
        username
        email
      }
    }
  }
`;

export const login = (
  input: LoginInput
): ThunkAction<void, AuthActionTypes> => async (dispatch, getState, ctx) => {
  dispatch(requestAuthPending());

  try {
    const res = await ctx.apollo.query<LoginData>({
      query: LOGIN_QUERY,
      variables: {
        input,
      },
    });
    if (!res.data) {
      throw new Error('no data returned from the server');
    }
    const data = res.data.login;
    const jwt = data.jwt;
    const user = pick(data.user, ['id', 'username', 'email']);

    dispatch(requestAuthSuccess(user));

    window.localStorage.setItem(AUTH_JWT_KEY, jwt);
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

    message.info(`logged in as @${user.username}`);
  } catch (error) {
    dispatch(requestAuthFailure(getErrorMessages(error)));
  }
};

export interface RefreshAuthInput {
  id: number;
}
export interface RefreshAuthData {
  refreshAuth: {
    jwt: string;
    user: {
      id: number;
      username: string;
      email: string;
    };
  };
}
const REFRESH_AUTH_QUERY = gql`
  query RefreshAuth($input: RefreshAuthInput!) {
    refreshAuth(input: $input) {
      jwt
      user {
        id
        username
        email
      }
    }
  }
`;
export const refreshAuth = (
  input: RefreshAuthInput
): ThunkAction<void, AuthActionTypes> => async (dispatch, getState, ctx) => {
  dispatch(requestAuthPending());
  try {
    const res = await ctx.apollo.query<RefreshAuthData>({
      query: REFRESH_AUTH_QUERY,
      variables: {
        input,
      },
    });
    if (!res.data) {
      throw new Error('jwt expired or invalid');
    }
    const data = res.data.refreshAuth;
    const jwt = data.jwt;
    const user = pick(data.user, ['id', 'username', 'email']);

    dispatch(requestAuthSuccess(user));

    window.localStorage.setItem(AUTH_JWT_KEY, jwt);
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error(error);
    dispatch(clearAuth());
  }
};

export const logout = (): ThunkAction<void, AuthActionTypes> => async (
  dispatch
) => {
  window.localStorage.removeItem(AUTH_JWT_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  dispatch(clearAuth());
};

export type AuthActionTypes =
  | RequestAuthPendingAction
  | RequestAuthSuccessAction
  | RequestAuthFailureAction
  | ClearAuthAction
  | ClearAuthErrorsAction;
