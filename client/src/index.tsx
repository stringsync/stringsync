import * as React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.less';
import createStore from './data/createStore';
import { Root } from './modules/root';

document.addEventListener('DOMContentLoaded', () => {
  const store = createStore();
  window.ss.store = store;
  ReactDOM.render(<Root store={store} />, document.getElementById('root'));
});
serviceWorker.register();
