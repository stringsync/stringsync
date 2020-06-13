import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { App, Routes } from './app';
import { createStore } from './store';
import { getWebConfig } from '@stringsync/config';

const config = getWebConfig(process.env);
const store = createStore();

ReactDOM.render(
  <React.StrictMode>
    <App store={store}>
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
