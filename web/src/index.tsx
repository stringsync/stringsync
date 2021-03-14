import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
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
  ReactDOM.hydrate(<App store={store} />, rootElement);
} else {
  ReactDOM.render(<App store={store} />, rootElement);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
