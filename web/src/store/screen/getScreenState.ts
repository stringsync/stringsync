import { BreakpointName, ScreenState } from './types';

type Breakpoint = [BreakpointName, number];

const BREAKPOINTS: Breakpoint[] = [
  ['xs', 576],
  ['sm', 768],
  ['md', 992],
  ['lg', 1200],
  ['xl', 1600],
  ['xxl', Number.POSITIVE_INFINITY],
];

export const getScreenState = (width: number, height: number): ScreenState => {
  const screenState: ScreenState = {
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xxl: false,
    breakpointName: 'xs', // will get reassigned before returning
    width,
    height,
  };

  for (const [breakpointName, breakpointPx] of BREAKPOINTS) {
    if (width < breakpointPx) {
      screenState[breakpointName] = true;
      screenState.breakpointName = breakpointName;
      return screenState;
    }
  }

  throw new RangeError(`could not compute a screen state for ${width}`);
};
