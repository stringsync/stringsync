import { createSlice } from '@reduxjs/toolkit';
import { HistoryReducers, HistoryState } from './types';

export const historySlice = createSlice<HistoryState, HistoryReducers, 'history'>({
  name: 'history',
  initialState: { prevRoute: '', returnToRoute: '/library' },
  reducers: {
    setPrevRoute(state, action) {
      state.prevRoute = action.payload;
    },
    setReturnToRoute(state, action) {
      state.returnToRoute = action.payload;
    },
  },
});

export const { setReturnToRoute } = historySlice.actions;
