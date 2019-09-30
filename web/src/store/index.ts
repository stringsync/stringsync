import createStore from './createStore';
import apollo from '../util/apollo';
import { ThunkAction as BaseThunkAction } from 'redux-thunk';
import * as Viewport from './modules/viewport';
import * as Device from './modules/device';
import * as Auth from './modules/auth';
import { Action } from 'redux';

export type Store = ReturnType<typeof createStore>;

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
  apollo: typeof apollo;
}

export type ThunkAction<R, A extends Action> = BaseThunkAction<
  R,
  RootState,
  ThunkContext,
  A
>;
