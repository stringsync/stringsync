import { ViewportState } from './types';
import { getViewportState } from './getViewportState';

export const getInitialViewportState = (): ViewportState => {
  return getViewportState('xs');
};
