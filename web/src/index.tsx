import React from 'react';
import ReactDOM from 'react-dom';
import Root from './modules/root/Root';
import App from './modules/app/App';
import * as serviceWorker from './serviceWorker';
import { getStore } from './store';
import { Client } from './client';
import { getConfig } from './util/getConfig';

const config = getConfig(process.env);
const client = Client.create(config.REACT_APP_SERVER_URI);
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
