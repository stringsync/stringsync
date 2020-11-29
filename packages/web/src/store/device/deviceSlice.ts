import { createSlice } from '@reduxjs/toolkit';
import { DeviceState, DeviceReducers } from './types';
import { getDeviceState } from './getDeviceState';

export const deviceSlice = createSlice<DeviceState, DeviceReducers, 'device'>({
  name: 'device',
  initialState: getDeviceState(navigator.userAgent || ''),
  reducers: {
    setUserAgent(state, action) {
      return getDeviceState(action.payload);
    },
  },
});

export const { setUserAgent } = deviceSlice.actions;
