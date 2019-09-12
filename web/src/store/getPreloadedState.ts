import getInitialViewportState from './modules/viewport/getInitialState';
import { RootState } from '.';

export const getPreloadedState = (): RootState => ({
  viewport: getInitialViewportState(),
});
