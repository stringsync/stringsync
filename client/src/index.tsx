import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Root } from 'root';
import { configure } from 'config';
import { registerServiceWorker } from 'utilities';
import { createStore } from 'data';

configure();
const store = createStore();
ReactDOM.render(<Root store={store} />, document.getElementById('root'));
registerServiceWorker();
