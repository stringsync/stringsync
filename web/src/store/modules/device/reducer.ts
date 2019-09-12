import { DeviceState, DeviceActionTypes, SET_USER_AGENT } from './types';
import getInitialState from './getInitialState';
import getDevice from './getDevice';

export default (
  state = getInitialState(),
  action: DeviceActionTypes
): DeviceState => {
  switch (action.type) {
    case SET_USER_AGENT:
      const { userAgent } = action.payload;
      return { userAgent, ...getDevice(userAgent) };
    default:
      return { ...state };
  }
};
