import { SET_USER_AGENT } from './constants';
import { SetUserAgentInput, SetUserAgentAction } from './types';

export const getSetUserAgentAction = (
  input: SetUserAgentInput
): SetUserAgentAction => ({
  type: SET_USER_AGENT,
  payload: input,
});
