import React from 'react';
import ReactDOM from 'react-dom';
import { App } from 'app';
import { configureAuth, registerServiceWorker } from 'utilities';

configureAuth();
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
