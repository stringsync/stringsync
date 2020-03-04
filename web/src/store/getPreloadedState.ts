import { RootState } from '.';
import {
  getInitialViewportState,
  getInitialDeviceState,
  getInitialAuthState,
  getInitialEmailState,
} from './';

export const getPreloadedState = (): RootState => ({
  viewport: getInitialViewportState(),
  device: getInitialDeviceState(),
  auth: getInitialAuthState(),
  email: getInitialEmailState(),
});
