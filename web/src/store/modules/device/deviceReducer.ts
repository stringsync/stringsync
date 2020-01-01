import { SET_USER_AGENT } from './constants';
import { DeviceState, DeviceActionTypes } from './types';
import { getDevice } from './getDevice';
import { getInitialDeviceState } from './getInitialDeviceState';

export const deviceReducer = (
  state = getInitialDeviceState(),
  action: DeviceActionTypes
): DeviceState => {
  switch (action.type) {
    case SET_USER_AGENT:
      const { userAgent } = action.payload;
      return { userAgent, device: { ...getDevice(userAgent) } };
    default:
      return state;
  }
};
