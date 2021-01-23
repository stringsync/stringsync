import { notification } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import { App, Routes } from './app';
import { AuthSync } from './components/AuthSync';
import { DeviceSync } from './components/DeviceSync';
import { ViewportSync } from './components/ViewportSync';
import * as serviceWorker from './serviceWorker';
import { createStore } from './store';

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

const store = createStore();

const StringSync = () => (
  <React.StrictMode>
    <App store={store}>
      <DeviceSync />
      <ViewportSync />
      <AuthSync />
      <Routes />
    </App>
  </React.StrictMode>
);

const rootElement = document.getElementById('root');
if (rootElement?.hasChildNodes()) {
  ReactDOM.hydrate(<StringSync />, rootElement);
} else {
  ReactDOM.render(<StringSync />, rootElement);
}
