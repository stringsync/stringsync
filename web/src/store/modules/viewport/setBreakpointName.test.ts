import { setBreakpointName } from './setBreakpointName';
import { SET_BREAKPOINT_NAME } from './constants';

it('creates SET_BREAKPOINT_NAME actions', () => {
  const breakpointName = 'xs';

  const action = setBreakpointName({
    breakpointName,
  });

  expect(action.type).toBe(SET_BREAKPOINT_NAME);
  expect(action.payload.breakpointName).toBe(breakpointName);
});
