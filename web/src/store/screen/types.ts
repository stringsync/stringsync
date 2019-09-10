export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface ScreenState {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  xxl: boolean;
  breakpointName: BreakpointName;
  width: number;
  height: number;
}

export const SET_DIMENSIONS = 'SET_DIMENSIONS';

interface SetDimesionsAction {
  type: typeof SET_DIMENSIONS;
  payload: {
    width: number;
    height: number;
  };
}

export type ScreenActionTypes = SetDimesionsAction;
