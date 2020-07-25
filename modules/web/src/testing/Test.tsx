import React from 'react';
import { App } from '../app';
import { createStore, AppStore } from '../store';

type Props = {
  store?: AppStore;
};

export const Test: React.FC<Props> = (props) => {
  const store = props.store || createStore();
  return <App store={store}>{props.children}</App>;
};
