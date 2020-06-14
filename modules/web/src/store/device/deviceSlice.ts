import { createSlice, CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { Device } from './types';
import { getDevice } from './getDevice';

type State = Device;

type Reducers = {
  setUserAgent: CaseReducer<State, PayloadAction<{ userAgent: string }>>;
};

export const deviceSlice = createSlice<State, Reducers, 'device'>({
  name: 'device',
  initialState: getDevice(navigator.userAgent || ''),
  reducers: {
    setUserAgent(state, action) {
      return getDevice(action.payload.userAgent);
    },
  },
});

export const { setUserAgent } = deviceSlice.actions;
