import { isMobile } from './isMobile';
import { getPreloadedState } from '../getPreloadedState';

it('returns if the device is mobile', () => {
  const state = getPreloadedState();

  state.device.device.mobile = true;
  expect(isMobile(state)).toBe(true);

  state.device.device.mobile = false;
  expect(isMobile(state)).toBe(false);
});
