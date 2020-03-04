import * as Viewport from './modules/viewport';
import * as Device from './modules/device';
import * as Auth from './modules/auth';
import * as Email from './modules/email';
import { getStore } from './getStore';
import { ThunkAction as BaseThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { StringSyncClient } from '../client';

export type Store = ReturnType<typeof getStore>;

export type Actions =
  | Viewport.ViewportActionTypes
  | Device.DeviceActionTypes
  | Auth.AuthActionTypes
  | Email.EmailActionTypes;

export interface RootState {
  viewport: Viewport.ViewportState;
  device: Device.DeviceState;
  auth: Auth.AuthState;
  email: Email.EmailState;
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
