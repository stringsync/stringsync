import { RootState } from '.';
import getInitialViewportState from './modules/viewport/getInitialState';
import getInitialDeviceState from './modules/device/getInitialState';

export const getPreloadedState = (): RootState => ({
  viewport: getInitialViewportState(),
  device: getInitialDeviceState(),
});
