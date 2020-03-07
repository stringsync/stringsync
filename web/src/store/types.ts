import * as Viewport from './modules/viewport';
import * as Device from './modules/device';
import * as Auth from './modules/auth';
import * as History from './modules/history';
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
