import { getViewportState } from './getViewportState';
import { BreakpointName } from './types';
import { pick } from 'lodash';

const BREAKPOINT_NAMES: BreakpointName[] = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
];

it.each(BREAKPOINT_NAMES)('computes viewport state', (breakpointName) => {
  const viewportState = getViewportState(breakpointName);
  expect(viewportState.breakpointName).toBe(breakpointName);

  const viewportStateTruths = pick(viewportState, BREAKPOINT_NAMES);
  for (const [key, value] of Object.entries(viewportStateTruths)) {
    const expectedValue = key === breakpointName;
    expect(value).toBe(expectedValue);
  }
});
