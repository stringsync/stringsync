import { createSlice } from '@reduxjs/toolkit';
import { ViewportState, ViewportReducers } from './types';
import { getViewportState } from './getViewportState';

export const viewportSlice = createSlice<ViewportState, ViewportReducers>({
  name: 'viewport',
  initialState: getViewportState('xs'),
  reducers: {
    setBreakpoint(state, action) {
      return getViewportState(action.payload.breakpoint);
    },
  },
});

export const { setBreakpoint } = viewportSlice.actions;
