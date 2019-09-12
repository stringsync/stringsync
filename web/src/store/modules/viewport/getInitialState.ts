import { ViewportState } from './types';
import getViewportState from './getViewportState';

export default (): ViewportState => {
  return getViewportState('xs');
};
