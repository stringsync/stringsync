import { createAction, createReducer } from '@reduxjs/toolkit';
import { noop } from 'lodash';
import React, { useReducer } from 'react';
import { getNullAuthUser } from './getNullAuthUser';
import { AuthState, AuthUser } from './types';

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
export const AuthDispatchCtx = React.createContext(noop);

export const AuthProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(authReducer, getInitialState());

  return (
    <AuthStateCtx.Provider value={state}>
      <AuthDispatchCtx.Provider value={dispatch}>{props.children}</AuthDispatchCtx.Provider>
    </AuthStateCtx.Provider>
  );
};
