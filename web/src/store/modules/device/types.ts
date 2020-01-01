import { SET_USER_AGENT } from './constants';

export type Device = {
  apple: {
    phone: boolean;
    ipod: boolean;
    tablet: boolean;
    device: boolean;
  };
  amazon: {
    phone: boolean;
    tablet: boolean;
    device: boolean;
  };
  android: {
    phone: boolean;
    tablet: boolean;
    device: boolean;
  };
  windows: {
    phone: boolean;
    tablet: boolean;
    device: boolean;
  };
  other: {
    blackberry: boolean;
    blackberry10: boolean;
    opera: boolean;
    firefox: boolean;
    chrome: boolean;
    device: boolean;
  };
  phone: boolean;
  tablet: boolean;
  mobile: boolean;
};

export interface DeviceState {
  userAgent: string;
  device: Device;
}

export interface SetUserAgentInput {
  userAgent: string;
}

export interface SetUserAgentAction {
  type: typeof SET_USER_AGENT;
  payload: {
    userAgent: string;
  };
}

export type DeviceActionTypes = SetUserAgentAction;
