import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from './';
import createStore from '../../data/createStore';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Root store={createStore()} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
