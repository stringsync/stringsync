import { Breakpoint, Viewport } from './types';

export const getViewport = (breakpoint: Breakpoint): Viewport => {
  const state = {
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xxl: false,
    breakpoint,
  };
  state[breakpoint] = true;
  return state;
};
