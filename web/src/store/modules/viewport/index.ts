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

export const SET_BREAKPOINT_NAME = 'SET_BREAKPOINT_NAME';

interface SetBreakpointNameAction {
  type: typeof SET_BREAKPOINT_NAME;
  payload: {
    breakpointName: BreakpointName;
  };
}

export type ViewportActionTypes = SetBreakpointNameAction;
