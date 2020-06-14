import { configureStore } from '@reduxjs/toolkit';
import { deviceSlice } from './device';
import { viewportSlice } from './viewport';

export const createStore = () => {
  return configureStore({
    reducer: {
      device: deviceSlice.reducer,
      viewport: viewportSlice.reducer,
    },
  });
};

export type AppStore = ReturnType<typeof createStore>;
