import { viewportReducer } from './viewportReducer';
import { getSetBreakpointNameAction } from './getSetBreakpointNameAction';
import { BreakpointName } from './types';
import { getViewportState } from './getViewportState';

it('handles SET_BREAKPOINT_NAME actions', () => {
  const breakpointName: BreakpointName = 'xs';
  const viewportState = getViewportState(breakpointName);
  const action = getSetBreakpointNameAction({ breakpointName });

  const state = viewportReducer(undefined, action);

  expect(state).toEqual(viewportState);
});
