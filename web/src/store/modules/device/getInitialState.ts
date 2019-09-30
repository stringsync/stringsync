import getDevice, { getUserAgent } from './getDevice';
import { DeviceState } from '.';

const getInitalState = (): DeviceState => {
  const userAgent = getUserAgent();
  const device = getDevice(userAgent);
  return {
    userAgent,
    ...device,
  };
};

export default getInitalState;
