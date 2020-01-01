import { RootState } from '../';

export const isMobile = (state: RootState): boolean => {
  return state.device.device.phone || state.device.device.tablet;
};
