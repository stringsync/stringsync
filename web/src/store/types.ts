import * as Viewport from './modules/viewport';
import * as Device from './modules/device';
import * as Auth from './modules/auth';
import { getStore } from './getStore';
import { ThunkAction as BaseThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { StringSyncClient } from '../client';

export type Store = ReturnType<typeof getStore>;

export type Actions =
  | Viewport.ViewportActionTypes
  | Device.DeviceActionTypes
  | Auth.AuthActionTypes;

export interface RootState {
  viewport: Viewport.ViewportState;
  device: Device.DeviceState;
  auth: Auth.AuthState;
}

export interface ThunkContext {
  client: StringSyncClient;
}

export type ThunkAction<R, A extends Action> = BaseThunkAction<
  R,
  RootState,
  ThunkContext,
  A
>;
