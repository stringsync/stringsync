import { User } from '@stringsync/domain';
import { PayloadAction, CaseReducer } from '@reduxjs/toolkit';

export type AuthUser = Pick<User, 'id' | 'email' | 'username' | 'role' | 'confirmedAt'>;

export type AuthState = {
  isPending: boolean;
  user: AuthUser;
  errors: string[];
};

export type AuthReducers = {
  confirmEmail: CaseReducer<AuthState, PayloadAction<{ confirmedAt: Date }>>;
  clearAuth: CaseReducer<AuthState>;
  clearAuthErrors: CaseReducer<AuthState>;
};
