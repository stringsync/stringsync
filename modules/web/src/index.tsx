import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { App, Routes } from './app';
import { createStore } from './store';
import { getWebConfig } from '@stringsync/config';
import { DeviceSync } from './components/DeviceSync';
import { ViewportSync } from './components/ViewportSync';
import { AuthSync } from './components/AuthSync';
import { createClients } from './clients';

const config = getWebConfig(process.env);
const store = createStore();
const clients = createClients();

ReactDOM.render(
  <React.StrictMode>
    <App store={store} clients={clients}>
      <DeviceSync />
      <ViewportSync />
      <AuthSync />
      <Routes />
    </App>
  </React.StrictMode>,
  document.getElementById('root')
);

if (config.NODE_ENV === 'production') {
  serviceWorker.register();
} else {
  serviceWorker.unregister();
}
