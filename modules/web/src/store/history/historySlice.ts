import { HistoryState, HistoryReducers } from './types';
import { createSlice } from '@reduxjs/toolkit';

export const historySlice = createSlice<HistoryState, HistoryReducers, 'history'>({
  name: 'history',
  initialState: { returnToRoute: '/library' },
  reducers: {
    setReturnToRoute(state, action) {
      state.returnToRoute = action.payload;
    },
  },
});

export const { setReturnToRoute } = historySlice.actions;
