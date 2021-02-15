import { createSlice } from '@reduxjs/toolkit';
import { getInitialSwState } from './getInitialSwState';
import { SwReducers, SwState } from './types';

export const swSlice = createSlice<SwState, SwReducers>({
  name: 'sw',
  initialState: getInitialSwState(),
  reducers: {
    success(state) {
      state.isInitialized = true;
      return state;
    },
    update(state, action) {
      state.isUpdated = true;
      state.registration = action.payload;
      return state;
    },
  },
});
