import React from 'react';
import { Store } from 'redux';
import { App } from '../app';
import { createStore } from '../store';

type Props = {
  store?: Store;
};

export const Test: React.FC<Props> = (props) => {
  const store = props.store || createStore();
  return <App store={store}>{props.children}</App>;
};
