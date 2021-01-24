import { AnyAction, Dispatch, EnhancedStore, ThunkDispatch } from '@reduxjs/toolkit';
import { AuthState } from './auth/types';
import { DeviceState } from './device/types';
import { HistoryState } from './history/types';
import { LibraryState } from './library/types';
import { SwState } from './sw/types';
import { TagState } from './tag/types';
import { ViewportState } from './viewport/types';

export type RootState = {
  device: DeviceState;
  viewport: ViewportState;
  auth: AuthState;
  history: HistoryState;
  library: LibraryState;
  tag: TagState;
  sw: SwState;
};

export type AppStore = EnhancedStore<RootState>;

export type AppDispatch = ThunkDispatch<any, null, AnyAction> &
  ThunkDispatch<any, undefined, AnyAction> &
  Dispatch<AnyAction>;
