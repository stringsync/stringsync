import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import { createStore } from './store';

const store = createStore();

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
