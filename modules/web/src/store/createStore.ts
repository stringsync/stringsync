import { configureStore } from '@reduxjs/toolkit';

export const createStore = () => {
  return configureStore({
    reducer: {},
  });
};

export type AppStore = ReturnType<typeof createStore>;
