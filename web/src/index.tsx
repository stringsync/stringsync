import React from 'react';
import ReactDOM from 'react-dom';
import Root from './modules/root/Root';
import App from './modules/app/App';
import * as serviceWorker from './serviceWorker';
import { getStore } from './store';
import { Client } from './client';

const uri = process.env.REACT_APP_SERVER_URI;
const client = Client.create(uri || '');
const store = getStore(client);

ReactDOM.render(
  <Root store={store}>
    <App />
  </Root>,
  document.getElementById('root')
);

if (process.env.NODE_ENV === 'production') {
  serviceWorker.register();
} else {
  serviceWorker.unregister();
}
