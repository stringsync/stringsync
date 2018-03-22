import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from 'root';
import { configureAuth, registerServiceWorker } from 'utilities';
import { store } from 'data';

configureAuth();
ReactDOM.render(<Root store={store} />, document.getElementById('root'));
registerServiceWorker();
