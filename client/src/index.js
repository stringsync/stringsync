import React from 'react';
import ReactDOM from 'react-dom';
import { App } from 'app';
import { configureAuth, registerServiceWorker } from 'utilities';
import { store } from 'data';

configureAuth();
ReactDOM.render(<App store={store} />, document.getElementById('root'));
registerServiceWorker();
