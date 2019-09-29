import createStore from './createStore';
import * as Viewport from './modules/viewport/types';
import * as Device from './modules/device/types';
import * as Auth from './modules/auth/types';

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
