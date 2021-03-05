import React from 'react';
import { AuthSync } from '../components/AuthSync';
import { DeviceSync } from '../components/DeviceSync';
import { ServiceWorkerSync } from '../components/ServiceWorkerSync';
import { ViewportSync } from '../components/ViewportSync';
import { AppStore } from '../store';
import { App } from './App';
import { Routes } from './routes';

type Props = {
  store: AppStore;
};

export const StringSync: React.FC<Props> = (props) => {
  return (
    <React.StrictMode>
      <App store={props.store}>
        <ServiceWorkerSync />
        <DeviceSync />
        <ViewportSync />
        <AuthSync />
        <Routes />
      </App>
    </React.StrictMode>
  );
};
