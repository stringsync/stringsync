import { ScreenState } from './types';
import { getScreenState } from './getScreenState';

export default (): ScreenState => {
  const width = window.innerWidth || 0;
  const height = window.innerHeight || 0;
  return getScreenState(width, height);
};
