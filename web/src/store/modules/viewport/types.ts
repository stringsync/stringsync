import { SET_BREAKPOINT_NAME } from './constants';

export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface ViewportState {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  xxl: boolean;
  breakpointName: BreakpointName;
}

export interface SetBreakpointNameInput {
  breakpointName: BreakpointName;
}

export interface SetBreakpointNameAction {
  type: typeof SET_BREAKPOINT_NAME;
  payload: {
    breakpointName: BreakpointName;
  };
}

export type ViewportActionTypes = SetBreakpointNameAction;
