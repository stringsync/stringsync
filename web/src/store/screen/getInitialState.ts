import { ScreenState } from './types';
import { getScreenState } from './getScreenState';

export default (): ScreenState => {
  return getScreenState('xs');
};
