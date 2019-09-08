import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/app/App';
import Root from './views/root/Root';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Root>
    <App />
  </Root>,
  document.getElementById('root')
);

if (process.env.NODE_ENV === 'production') {
  serviceWorker.register();
} else {
  serviceWorker.unregister();
}
