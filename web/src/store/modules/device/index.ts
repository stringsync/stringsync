import { Device } from './getDevice';

export type DeviceState = Device & {
  userAgent: string;
};

export const SET_USER_AGENT = 'SET_USER_AGENT';

interface SetUserAgentAction {
  type: typeof SET_USER_AGENT;
  payload: {
    userAgent: string;
  };
}

export type DeviceActionTypes = SetUserAgentAction;
