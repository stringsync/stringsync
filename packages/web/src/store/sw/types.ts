import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';

export type SwState = {
  isInitialized: boolean;
  isUpdated: boolean;
  registration: ServiceWorkerRegistration | null;
};

export type SwReducers = {
  success: CaseReducer<SwState>;
  update: CaseReducer<SwState, PayloadAction<ServiceWorkerRegistration>>;
};
