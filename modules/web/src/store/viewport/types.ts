import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type ViewportState = {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  xxl: boolean;
  breakpoint: Breakpoint;
};

export type ViewportReducers = {
  setBreakpoint: CaseReducer<ViewportState, PayloadAction<{ breakpoint: Breakpoint }>>;
};
