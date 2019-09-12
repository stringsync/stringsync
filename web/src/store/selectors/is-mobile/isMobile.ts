import { RootState } from '../..';

const isMobile = (state: RootState): boolean => {
  return state.device.phone || state.device.tablet;
};

export default isMobile;
