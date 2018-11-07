import * as React from 'react';
import ReactDOM from 'react-dom';
import { App } from './modules/app';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.less';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.register();
