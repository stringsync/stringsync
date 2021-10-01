import { createAction, createReducer } from '@reduxjs/toolkit';
import { noop } from 'lodash';
import React, { useCallback, useReducer } from 'react';
import { $gql, GRAPHQL_URI, LoginInput, SendResetPasswordEmailInput, SignupInput } from '../../graphql';
import { useFetch } from '../../hooks/useFetch';
import { useGql } from '../../hooks/useGql';
import { getNullAuthUser } from './getNullAuthUser';
import * as helpers from './helpers';
import * as queries from './queries';
import { AuthState, AuthUser } from './types';

export type AuthApi = {
  authenticate(): void;
  login(input: LoginInput): void;
  logout(): void;
  signup(input: SignupInput): void;
  sendResetPasswordEmail(input: SendResetPasswordEmailInput): void;
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
  });
  builder.addCase(AUTH_ACTIONS.setUser, (state, action) => {
    state.isPending = false;
    state.errors = [];
    state.user = action.payload.user;
  });
  builder.addCase(AUTH_ACTIONS.setErrors, (state, action) => {
    state.isPending = false;
    state.errors = action.payload.errors;
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
  sendResetPasswordEmail: noop,
  signup: noop,
});

export const AuthProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(authReducer, getInitialState());

  const [authenticate] = useGql(queries.whoami, {
    then: async (res) => {
      const whoami = res.data?.whoami;
      const user = whoami ? helpers.toAuthUser(whoami) : getNullAuthUser();
      dispatch(AUTH_ACTIONS.setUser({ user }));
    },
  });

  const [loginFetch] = useFetch({
    then: async (res) => {
      const gql = await $gql.toGqlResponse<typeof queries.login>(res);
      const login = gql.data?.login;
      const user = login ? helpers.toAuthUser(login) : getNullAuthUser();
      dispatch(AUTH_ACTIONS.setUser({ user }));
    },
  });
  const login = useCallback(
    (input: LoginInput) => {
      loginFetch(GRAPHQL_URI, queries.login.toRequestInit({ input }));
    },
    [loginFetch]
  );

  const [logoutFetch] = useFetch({
    then: async (res) => {
      const user = getNullAuthUser();
      dispatch(AUTH_ACTIONS.setUser({ user }));
    },
  });
  const logout = useCallback(() => {
    logoutFetch(GRAPHQL_URI, queries.logout.toRequestInit());
  }, [logoutFetch]);

  return <AuthStateCtx.Provider value={state}>{props.children}</AuthStateCtx.Provider>;
};
