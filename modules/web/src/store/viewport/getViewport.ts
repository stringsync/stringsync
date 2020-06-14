import { Breakpoint, Viewport } from './types';

export const getViewport = (breakpoint: Breakpoint): Viewport => {
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
