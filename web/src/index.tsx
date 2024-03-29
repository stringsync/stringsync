import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { REACT_SNAP_ACTIVE } from './constants';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorkerRegistration';

const rootElement = document.getElementById('root');
if (rootElement?.hasChildNodes()) {
  hydrateRoot(rootElement, <App />);
} else {
  const root = createRoot(rootElement!);
  root.render(<App />);
}

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
if (isLocalhost) {
  serviceWorker.unregister();
} else if (!REACT_SNAP_ACTIVE) {
  serviceWorker.register();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
