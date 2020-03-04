import { setUserAgent } from './setUserAgent';
import { SET_USER_AGENT } from './constants';

it('creates SET_USER_AGENT actions', () => {
  const userAgent = 'userAgent';
  const action = setUserAgent({ userAgent });
  expect(action.type).toBe(SET_USER_AGENT);
  expect(action.payload.userAgent).toBe(userAgent);
});
