import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Root } from 'modules/root';
import { configure } from 'config';
import { registerServiceWorker } from 'utilities';
import { createStore } from 'data';

configure();
ReactDOM.render(<Root store={createStore()} />, document.getElementById('root'));
registerServiceWorker();
