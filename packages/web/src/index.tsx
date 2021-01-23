import React from 'react';
import ReactDOM from 'react-dom';
import { App, Routes } from './app';
import { AuthSync } from './components/AuthSync';
import { DeviceSync } from './components/DeviceSync';
import { ViewportSync } from './components/ViewportSync';
import * as serviceWorker from './serviceWorker';
import { createStore, swSlice } from './store';

const store = createStore();

serviceWorker.register({
  onSuccess: () => {
    store.dispatch(swSlice.actions.success());
  },
  onUpdate: (registration) => {
    store.dispatch(swSlice.actions.update(registration));
  },
});

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
