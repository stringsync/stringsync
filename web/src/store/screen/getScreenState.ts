import { BreakpointName, ScreenState } from './types';

export const getScreenState = (breakpointName: BreakpointName): ScreenState => {
  const screenState: ScreenState = {
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xxl: false,
    breakpointName,
  };
  screenState[breakpointName] = true;
  return screenState;
};
