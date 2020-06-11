import * as Viewport from './viewport';
import * as Device from './device';
import * as Auth from './auth';
import * as History from './history';
import { getStore } from './getStore';
import { ThunkAction as _ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { StringSyncClient } from '../client';

export type Store = ReturnType<typeof getStore>;

export type Actions =
  | Viewport.ViewportActionTypes
  | Device.DeviceActionTypes
  | Auth.AuthActionTypes
  | History.HistoryActions;

export interface RootState {
  viewport: Viewport.ViewportState;
  device: Device.DeviceState;
  auth: Auth.AuthState;
  history: History.HistoryState;
}

export interface ThunkContext {
  client: StringSyncClient;
}

export type ThunkAction<R, A extends Action> = _ThunkAction<
  R,
  RootState,
  ThunkContext,
  A
>;
