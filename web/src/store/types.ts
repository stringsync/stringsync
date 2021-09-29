import { AnyAction, Dispatch, EnhancedStore, ThunkDispatch } from '@reduxjs/toolkit';
import { AuthState } from './auth/types';
import { HistoryState } from './history/types';

export type RootState = {
  auth: AuthState;
  history: HistoryState;
};

export type AppStore = EnhancedStore<RootState>;

export type AppDispatch = ThunkDispatch<any, null, AnyAction> &
  ThunkDispatch<any, undefined, AnyAction> &
  Dispatch<AnyAction>;
