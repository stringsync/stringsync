import { RootState } from '.';
import {
  getInitialViewportState,
  getInitialDeviceState,
  getInitialAuthState,
} from './';

export const getPreloadedState = (): RootState => ({
  viewport: getInitialViewportState(),
  device: getInitialDeviceState(),
  auth: getInitialAuthState(),
});
