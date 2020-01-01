import { getDevice } from './getDevice';
import { getUserAgent } from './getUserAgent';
import { DeviceState } from './types';

export const getInitialDeviceState = (): DeviceState => {
  const userAgent = getUserAgent();
  const device = getDevice(userAgent);
  return { userAgent, device };
};
