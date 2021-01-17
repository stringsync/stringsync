import { notification } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import { App, Routes } from './app';
import { AuthSync } from './components/AuthSync';
import { DeviceSync } from './components/DeviceSync';
import { ViewportSync } from './components/ViewportSync';
import * as serviceWorker from './serviceWorker';
import { createStore } from './store';

const store = createStore();

serviceWorker.register({
  onUpdate: () => {
    notification.info({
      message: 'new content',
      description: 'New content is available and will be used when all tabs for this page are closed.',
      placement: 'bottomLeft',
      duration: null,
    });
  },
});

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
