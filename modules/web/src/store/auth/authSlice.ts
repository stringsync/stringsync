import { createSlice, CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from './types';
import { getNullAuthUser } from './getNullAuthUser';

type State = {
  isPending: boolean;
  user: AuthUser;
  isLoggedIn: boolean;
  errors: string[];
};

type Reducers = {
  authPending: CaseReducer<State>;
  authSuccess: CaseReducer<State, PayloadAction<{ user: AuthUser }>>;
  authFailure: CaseReducer<State, PayloadAction<{ errors: string[] }>>;
  confirmEmail: CaseReducer<State, PayloadAction<{ confirmedAt: Date }>>;
  clearAuth: CaseReducer<State>;
  clearAuthErrors: CaseReducer<State>;
};

const getNullState = (): State => ({
  isPending: true,
  user: getNullAuthUser(),
  isLoggedIn: false,
  errors: [],
});

export const authSlice = createSlice<State, Reducers>({
  name: 'auth',
  initialState: getNullState(),
  reducers: {
    authPending(state) {
      state.isPending = true;
      state.errors = [];
    },
    authSuccess(state, action) {
      state.user = action.payload.user;
    },
    authFailure(state, action) {
      state.errors = action.payload.errors;
    },
    confirmEmail(state, action) {
      state.user.confirmedAt = action.payload.confirmedAt;
    },
    clearAuth() {
      return getNullState();
    },
    clearAuthErrors(state) {
      state.errors = [];
    },
  },
});

export const { authPending, authSuccess, authFailure, confirmEmail, clearAuth, clearAuthErrors } = authSlice.actions;
