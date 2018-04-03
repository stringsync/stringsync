import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Root } from 'root';
import { registerServiceWorker } from 'utilities';
import { store } from 'data';

ReactDOM.render(<Root store={store} />, document.getElementById('root') as HTMLDivElement);
registerServiceWorker();