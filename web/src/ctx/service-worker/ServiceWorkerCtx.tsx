import { createAction, createReducer } from '@reduxjs/toolkit';
import React, { useEffect, useReducer } from 'react';
import * as serviceWorker from '../../serviceWorkerRegistration';
import { ServiceWorkerState } from './types';

const SERVICE_WORKER_ACTIONS = {
  success: createAction('success'),
  update: createAction<{ registration: ServiceWorkerRegistration }>('update'),
};

const getInitialState = (): ServiceWorkerState => ({
  isInitialized: false,
  isUpdated: false,
  registration: null,
});

export const serviceWorkerReducer = createReducer(getInitialState(), (builder) => {
  builder.addCase(SERVICE_WORKER_ACTIONS.success, (state, action) => {
    state.isInitialized = true;
  });
  builder.addCase(SERVICE_WORKER_ACTIONS.update, (state, action) => {
    state.isUpdated = true;
    state.registration = action.payload.registration;
  });
});

export const ServiceWorkerCtx = React.createContext<ServiceWorkerState>(getInitialState());

export const ServiceWorkerProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(serviceWorkerReducer, getInitialState());

  useEffect(() => {
    serviceWorker.register({
      onSuccess: () => {
        dispatch(SERVICE_WORKER_ACTIONS.success());
      },
      onUpdate: (registration) => {
        dispatch(SERVICE_WORKER_ACTIONS.update({ registration }));
      },
    });
  }, []);

  return <ServiceWorkerCtx.Provider value={state}>{props.children}</ServiceWorkerCtx.Provider>;
};
