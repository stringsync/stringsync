import React from 'react';
import ReactDOM from 'react-dom';
import { StringSync } from './app';
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

const rootElement = document.getElementById('root');
if (rootElement?.hasChildNodes()) {
  ReactDOM.hydrate(<StringSync store={store} />, rootElement);
} else {
  ReactDOM.render(<StringSync store={store} />, rootElement);
}
