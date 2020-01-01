import { deviceReducer } from './deviceReducer';
import { getDevice } from './getDevice';
import { getSetUserAgentAction } from './getSetUserAgentAction';

it('handles SET_USER_AGENT actions', () => {
  const userAgent = 'userAgent';
  const device = getDevice(userAgent);
  const action = getSetUserAgentAction({ userAgent });

  const state = deviceReducer(undefined, action);

  expect(state.userAgent).toBe(userAgent);
  expect(state.device).toEqual(device);
});
