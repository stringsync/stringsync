import { SET_USER_AGENT } from './constants';
import { DeviceState, DeviceActionTypes } from './types';
import { getDevice } from './getDevice';
import getInitialState from './getInitialState';

export const deviceReducer = (
  state = getInitialState(),
  action: DeviceActionTypes
): DeviceState => {
  switch (action.type) {
    case SET_USER_AGENT:
      const { userAgent } = action.payload;
      return { userAgent, ...getDevice(userAgent) };
    default:
      return state;
  }
};
