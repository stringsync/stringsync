import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../domain';

export type AuthUser = Pick<User, 'id' | 'email' | 'username' | 'role'> & {
  confirmedAt: null | string;
};

export type AuthState = {
  isPending: boolean;
  user: AuthUser;
  errors: string[];
};

export type AuthReducers = {
  confirmEmail: CaseReducer<AuthState, PayloadAction<{ confirmedAt: string }>>;
  clearAuth: CaseReducer<AuthState>;
  clearAuthErrors: CaseReducer<AuthState>;
};
