import { gql } from 'apollo-boost';
import { ThunkAction } from '../..';
import { pick } from 'lodash';
import { message } from 'antd';
import getErrorMessages from './getErrorMessages';
import { User } from 'common/types';

export type AuthUser = Pick<User, 'id' | 'email' | 'username'>;

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
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
}
const SIGNUP_MUTATION = gql`
  mutation($input: SignupInput!) {
    signup(input: $input) {
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
    const user = pick(data.user, ['id', 'username', 'email']);

    dispatch(requestAuthSuccess(user));

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
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
}
const LOGIN_MUTATION = gql`
  mutation($input: LoginInput!) {
    login(input: $input) {
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
    const res = await ctx.apollo.mutate<LoginData>({
      mutation: LOGIN_MUTATION,
      variables: {
        input,
      },
    });
    if (!res.data) {
      throw new Error('no data returned from the server');
    }
    const data = res.data.login;
    const user = pick(data.user, ['id', 'username', 'email']);

    dispatch(requestAuthSuccess(user));

    message.info(`logged in as @${user.username}`);
  } catch (error) {
    dispatch(requestAuthFailure(getErrorMessages(error)));
  }
};

export interface ReauthData {
  reauth: {
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
}
const REAUTH_MUTATION = gql`
  mutation {
    reauth {
      user {
        id
        username
        email
      }
    }
  }
`;
export const reauth = (): ThunkAction<void, AuthActionTypes> => async (
  dispatch,
  getState,
  ctx
) => {
  dispatch(requestAuthPending());
  try {
    const res = await ctx.apollo.mutate<ReauthData>({
      mutation: REAUTH_MUTATION,
    });
    if (!res.data) {
      throw new Error('jwt expired or invalid');
    }
    const user = pick(res.data.reauth.user, ['id', 'username', 'email']);
    dispatch(requestAuthSuccess(user));
  } catch (error) {
    // ensure the jwt gets removed
    // logout should remove the isPending status, too
    dispatch(logout());
  }
};

interface LogoutData {
  ok: boolean;
}
const LOGOUT_MUTATION = gql`
  mutation {
    logout {
      ok
    }
  }
`;
export const logout = (): ThunkAction<void, AuthActionTypes> => async (
  dispatch,
  getState,
  ctx
) => {
  dispatch(clearAuth());
  try {
    ctx.apollo.mutate<LogoutData>({
      mutation: LOGOUT_MUTATION,
    });
  } catch (error) {
    // TODO use sentry or some other tool that will track
    // when logouts fail
    console.error(error);
  }
};

export type AuthActionTypes =
  | RequestAuthPendingAction
  | RequestAuthSuccessAction
  | RequestAuthFailureAction
  | ClearAuthAction
  | ClearAuthErrorsAction;
