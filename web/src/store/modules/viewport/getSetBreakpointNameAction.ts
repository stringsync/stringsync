import { SET_BREAKPOINT_NAME } from './constants';
import { SetBreakpointNameInput, SetBreakpointNameAction } from './types';

export const getSetBreakpointNameAction = (
  input: SetBreakpointNameInput
): SetBreakpointNameAction => ({
  type: SET_BREAKPOINT_NAME,
  payload: input,
});
