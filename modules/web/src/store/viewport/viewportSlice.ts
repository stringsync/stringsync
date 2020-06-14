import { createSlice, CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { Viewport, Breakpoint } from './types';
import { getViewport } from './getViewport';

type State = Viewport;

type Reducers = {
  setBreakpoint: CaseReducer<State, PayloadAction<{ breakpoint: Breakpoint }>>;
};

export const viewportSlice = createSlice<State, Reducers>({
  name: 'viewport',
  initialState: getViewport('xs'),
  reducers: {
    setBreakpoint(state, action) {
      return getViewport(action.payload.breakpoint);
    },
  },
});

export const { setBreakpoint } = viewportSlice.actions;
