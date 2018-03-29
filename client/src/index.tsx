import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Root } from 'root';
import { registerServiceWorker } from 'utilities';

declare global {
  interface Window {
    ss: {
      env: string,
      notification: void,
      message: void,
    };
  }
}

ReactDOM.render(<Root />, document.getElementById('root') as HTMLElement);
registerServiceWorker();