import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from 'root';
import { registerServiceWorker } from 'utilities';
import { store } from 'data';
import { configure } from 'config';

configure();
ReactDOM.render(<Root store={store} />, document.getElementById('root'));
registerServiceWorker();
