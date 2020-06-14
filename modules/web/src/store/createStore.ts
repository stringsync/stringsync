import { configureStore } from '@reduxjs/toolkit';
import { deviceSlice } from './device';

export const createStore = () => {
  return configureStore({
    reducer: {
      device: deviceSlice.reducer,
    },
  });
};

export type AppStore = ReturnType<typeof createStore>;
