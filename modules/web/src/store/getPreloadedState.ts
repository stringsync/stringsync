import { RootState } from '.';
import {
  getInitialViewportState,
  getInitialDeviceState,
  getInitialAuthState,
  getInitialHistoryState,
} from './';

export const getPreloadedState = (): RootState => ({
  viewport: getInitialViewportState(),
  device: getInitialDeviceState(),
  auth: getInitialAuthState(),
  history: getInitialHistoryState(),
});
