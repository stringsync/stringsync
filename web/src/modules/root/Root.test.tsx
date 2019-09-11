import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
import createStore from '../../store/createStore';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const store = createStore();
  ReactDOM.render(<Root store={store} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
