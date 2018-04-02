import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Root } from 'root';
import { registerServiceWorker } from 'utilities';

ReactDOM.render(<Root store={undefined} />, document.getElementById('root') as HTMLElement);
registerServiceWorker();