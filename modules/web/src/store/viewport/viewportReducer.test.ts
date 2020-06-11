import { viewportReducer } from './viewportReducer';
import { setBreakpointName } from './setBreakpointName';
import { BreakpointName } from './types';
import { getViewportState } from './getViewportState';

it('handles SET_BREAKPOINT_NAME actions', () => {
  const breakpointName: BreakpointName = 'xs';
  const viewportState = getViewportState(breakpointName);
  const action = setBreakpointName({ breakpointName });

  const state = viewportReducer(undefined, action);

  expect(state).toEqual(viewportState);
});
