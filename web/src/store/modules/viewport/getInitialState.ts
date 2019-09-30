import { ViewportState } from '.';
import getViewportState from './getViewportState';

export default (): ViewportState => {
  return getViewportState('xs');
};
