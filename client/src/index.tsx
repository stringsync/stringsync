import * as React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.less';
import { Root } from './modules/root';
import configureApp from './config/configureApp';

document.addEventListener('DOMContentLoaded', () => {
  configureApp();
  ReactDOM.render(<Root store={window.ss.store} />, document.getElementById('root'));
  serviceWorker.register();
});
