import { Breakpoint } from './types';
import { ViewportState } from './ViewportCtx';

export const getViewportState = (breakpoint: Breakpoint): ViewportState => {
  const viewport = {
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xxl: false,
    breakpoint,
  };
  viewport[breakpoint] = true;
  return viewport;
};
