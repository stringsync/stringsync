import { deviceReducer } from './deviceReducer';
import { getDevice } from './getDevice';
import { setUserAgent } from './setUserAgent';

it('handles SET_USER_AGENT actions', () => {
  const userAgent = 'userAgent';
  const device = getDevice(userAgent);
  const action = setUserAgent({ userAgent });

  const state = deviceReducer(undefined, action);

  expect(state.userAgent).toBe(userAgent);
  expect(state.device).toEqual(device);
});
