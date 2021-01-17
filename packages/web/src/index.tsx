import React from 'react';
import ReactDOM from 'react-dom';
import { App, Routes } from './app';
import { AuthSync } from './components/AuthSync';
import { DeviceSync } from './components/DeviceSync';
import { ViewportSync } from './components/ViewportSync';
import { WEB_CONFIG } from './config';
import * as serviceWorker from './serviceWorker';
import { createStore } from './store';

const config = WEB_CONFIG(process.env);
const store = createStore();

ReactDOM.render(
  <React.StrictMode>
    <App store={store}>
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
