import { HistoryState } from './history/types';
import { AuthState } from './auth/types';
import { ViewportState } from './viewport/types';
import { DeviceState } from './device/types';
import { EnhancedStore, ThunkDispatch, AnyAction, Dispatch } from '@reduxjs/toolkit';
import { LibraryState } from './library/types';
import { TagState } from './tag/types';

export type RootState = {
  device: DeviceState;
  viewport: ViewportState;
  auth: AuthState;
  history: HistoryState;
  library: LibraryState;
  tag: TagState;
};

export type AppStore = EnhancedStore<RootState>;

export type AppDispatch = ThunkDispatch<any, null, AnyAction> &
  ThunkDispatch<any, undefined, AnyAction> &
  Dispatch<AnyAction>;