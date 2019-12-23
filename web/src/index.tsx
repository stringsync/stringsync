import React from 'react';
import ReactDOM from 'react-dom';
import Root from './modules/root/Root';
import App from './modules/app/App';
import * as serviceWorker from './serviceWorker';
import { createStore } from './store';
import { createApolloClient } from './util';

const apollo = createApolloClient();
const store = createStore(apollo);

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
