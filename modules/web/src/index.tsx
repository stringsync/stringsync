import React from 'react';
import ReactDOM from 'react-dom';
import Root from './pages/Root/Root';
import App from './pages/App/App';
import * as serviceWorker from './serviceWorker';
import { getStore } from './store';
import { Client } from './client';
import { getWebConfig } from '@stringsync/config';

const config = getWebConfig(process.env);
const client = new Client(config.REACT_APP_SERVER_URI);
const store = getStore(client);

ReactDOM.render(
  <Root store={store} client={client}>
    <App />
  </Root>,
  document.getElementById('root')
);

if (process.env.NODE_ENV === 'production') {
  serviceWorker.register();
} else {
  serviceWorker.unregister();
}
