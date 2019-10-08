import { Device } from './getDevice';

export type DeviceState = Device & {
  userAgent: string;
};

export const SET_USER_AGENT = 'device/SET_USER_AGENT';
interface SetUserAgentInput {
  userAgent: string;
}
interface SetUserAgentAction {
  type: typeof SET_USER_AGENT;
  payload: {
    userAgent: string;
  };
}
export const createSetUserAgentAction = (
  input: SetUserAgentInput
): SetUserAgentAction => ({
  type: SET_USER_AGENT,
  payload: input,
});

export type DeviceActionTypes = SetUserAgentAction;
