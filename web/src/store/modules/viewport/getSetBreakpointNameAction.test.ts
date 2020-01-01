import { getSetBreakpointNameAction } from './getSetBreakpointNameAction';
import { SET_BREAKPOINT_NAME } from './constants';

it('creates SET_BREAKPOINT_NAME actions', () => {
  const breakpointName = 'xs';

  const action = getSetBreakpointNameAction({
    breakpointName,
  });

  expect(action.type).toBe(SET_BREAKPOINT_NAME);
  expect(action.payload.breakpointName).toBe(breakpointName);
});
