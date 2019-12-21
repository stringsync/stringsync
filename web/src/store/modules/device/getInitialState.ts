import { getDevice } from './getDevice';
import { getUserAgent } from './getUserAgent';
import { DeviceState } from './types';

const getInitalState = (): DeviceState => {
  const userAgent = getUserAgent();
  const device = getDevice(userAgent);
  return {
    userAgent,
    ...device,
  };
};

export default getInitalState;
