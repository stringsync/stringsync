import { BreakpointName, ViewportState } from './types';

export const getViewportState = (
  breakpointName: BreakpointName
): ViewportState => {
  const viewportState: ViewportState = {
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xxl: false,
    breakpointName,
  };
  viewportState[breakpointName] = true;
  return viewportState;
};
