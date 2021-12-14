import { createAction, createReducer } from '@reduxjs/toolkit';
import { noop } from 'lodash';
import React, { useCallback, useMemo, useReducer } from 'react';
import { UNKNOWN_ERROR_MSG } from '../../errors';
import { LoginInput, SignupInput } from '../../graphql';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { useGql } from '../../hooks/useGql';
import { getNullAuthUser } from './getNullAuthUser';
import * as helpers from './helpers';
import * as queries from './queries';
import { AuthState, AuthUser } from './types';

export type AuthApi = {
  authenticate(): void;
  login(variables: { input: LoginInput }): void;
  logout(): void;
  signup(variables: { input: SignupInput }): void;
  clearErrors(): void;
  reset(): void;
};

const getInitialState = (): AuthState => ({
  isPending: true,
  errors: [],
  user: getNullAuthUser(),
});

export const AUTH_ACTIONS = {
  pending: createAction('pending'),
  setUser: createAction<{ user: AuthUser }>('setUser'),
  setErrors: createAction<{ errors: string[] }>('setErrors'),
  reset: createAction('reset'),
  clearErrors: createAction('clearErrors'),
};

const authReducer = createReducer(getInitialState(), (builder) => {
  builder.addCase(AUTH_ACTIONS.pending, (state) => {
    state.isPending = true;
    state.errors = [];
  });
  builder.addCase(AUTH_ACTIONS.setUser, (state, action) => {
    state.isPending = false;
    state.errors = [];
    state.user = action.payload.user;
  });
  builder.addCase(AUTH_ACTIONS.setErrors, (state, action) => {
    state.isPending = false;
    state.errors = action.payload.errors;
    state.user = getNullAuthUser();
  });
  builder.addCase(AUTH_ACTIONS.clearErrors, (state) => {
    state.errors = [];
  });
  builder.addCase(AUTH_ACTIONS.reset, (state) => {
    state.user = getNullAuthUser();
    state.isPending = false;
    state.errors = [];
  });
});

export const AuthStateCtx = React.createContext<AuthState>(getInitialState());
export const AuthApiCtx = React.createContext<AuthApi>({
  authenticate: noop,
  login: noop,
  logout: noop,
  signup: noop,
  clearErrors: noop,
  reset: noop,
});

export const AuthProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(authReducer, getInitialState());

  const { execute: authenticate } = useGql(queries.whoami, {
    beforeLoading: () => {
      dispatch(AUTH_ACTIONS.pending());
    },
    onData: (data) => {
      dispatch(AUTH_ACTIONS.setUser({ user: helpers.toAuthUser(data.whoami) }));
    },
  });

  const { execute: login } = useGql(queries.login, {
    beforeLoading: () => {
      dispatch(AUTH_ACTIONS.pending());
    },
    onData: (data) => {
      switch (data.login?.__typename) {
        case 'User':
          dispatch(AUTH_ACTIONS.setUser({ user: data.login }));
          break;
        default:
          dispatch(AUTH_ACTIONS.setErrors({ errors: [data.login?.message || UNKNOWN_ERROR_MSG] }));
      }
    },
  });

  const { execute: logout } = useGql(queries.logout, {
    beforeLoading: () => {
      dispatch(AUTH_ACTIONS.pending());
    },
    onData: (data) => {
      switch (data.logout?.__typename) {
        case 'Processed':
          dispatch(AUTH_ACTIONS.setUser({ user: getNullAuthUser() }));
          break;
        default:
          dispatch(AUTH_ACTIONS.setErrors({ errors: [data.logout?.message || UNKNOWN_ERROR_MSG] }));
      }
    },
  });

  const { execute: signup } = useGql(queries.signup, {
    beforeLoading: () => {
      dispatch(AUTH_ACTIONS.pending());
    },
    onData: (data) => {
      switch (data.signup?.__typename) {
        case 'User':
          dispatch(AUTH_ACTIONS.setUser({ user: data.signup }));
          break;
        case 'ValidationError':
          dispatch(AUTH_ACTIONS.setErrors({ errors: data.signup.details }));
          break;
        default:
          dispatch(AUTH_ACTIONS.setErrors({ errors: [data.signup?.message || UNKNOWN_ERROR_MSG] }));
      }
    },
  });

  const clearErrors = useCallback(() => {
    dispatch(AUTH_ACTIONS.clearErrors());
  }, []);

  const reset = useCallback(() => {
    dispatch(AUTH_ACTIONS.reset());
  }, []);

  useEffectOnce(() => {
    authenticate();
  });

  const api = useMemo<AuthApi>(
    () => ({
      authenticate,
      login,
      logout,
      signup,
      clearErrors,
      reset,
    }),
    [authenticate, login, logout, signup, clearErrors, reset]
  );

  return (
    <AuthStateCtx.Provider value={state}>
      <AuthApiCtx.Provider value={api}>{props.children}</AuthApiCtx.Provider>
    </AuthStateCtx.Provider>
  );
};
