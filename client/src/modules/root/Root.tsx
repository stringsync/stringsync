import * as React from 'react';
import { App } from '../app';
import { Provider } from 'react-redux';

interface IProps {
  store: any;
}

export const Root: React.SFC<IProps> = (props) => (
  <div id="root">
    <Provider store={props.store}>
      <App />
    </Provider>
  </div>
);
