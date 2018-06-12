import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Root } from 'root';
import { configure } from 'config';
import { registerServiceWorker } from 'utilities';
// import { store } from 'data';

configure();
ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
