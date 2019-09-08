import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
import createStore from '../../store/createStore';
import { theme } from '../../theme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const store = createStore();
  ReactDOM.render(<Root store={store} theme={theme} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
