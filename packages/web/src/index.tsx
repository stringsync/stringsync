import React from 'react';
import ReactDOM from 'react-dom';
import { App, Routes } from './app';
import { AuthSync } from './components/AuthSync';
import { DeviceSync } from './components/DeviceSync';
import { ViewportSync } from './components/ViewportSync';
import * as serviceWorker from './serviceWorker';
import { createStore } from './store';

const store = createStore();
serviceWorker.register();

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
