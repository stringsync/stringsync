import { RootState } from '../';

export const isMobile = (state: RootState): boolean => {
  return state.device.device.mobile;
};
