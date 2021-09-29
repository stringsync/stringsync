import { AnyAction, Dispatch, EnhancedStore, ThunkDispatch } from '@reduxjs/toolkit';
import { AuthState } from './auth/types';
import { HistoryState } from './history/types';
import { SwState } from './sw/types';

export type RootState = {
  auth: AuthState;
  history: HistoryState;
  sw: SwState;
};

export type AppStore = EnhancedStore<RootState>;

export type AppDispatch = ThunkDispatch<any, null, AnyAction> &
  ThunkDispatch<any, undefined, AnyAction> &
  Dispatch<AnyAction>;
