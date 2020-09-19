import { DeviceState } from './types';
import { deviceSlice, setUserAgent } from './deviceSlice';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { getDeviceState } from './getDeviceState';

let store: EnhancedStore<{ device: DeviceState }>;

beforeEach(() => {
  store = configureStore({
    reducer: {
      device: deviceSlice.reducer,
    },
  });
});

it('initializes state', () => {
  expect(navigator.userAgent).toBeTruthy();
  expect(store.getState().device).toStrictEqual(getDeviceState(navigator.userAgent));
});

it('sets user agent', () => {
  store.dispatch(setUserAgent(''));
  expect(store.getState().device).toStrictEqual(getDeviceState(''));
});
