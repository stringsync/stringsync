import React, { useMemo } from 'react';
import { App } from '../app';
import { AppStore, createStore } from '../store';

type Props = {
  store?: AppStore;
};

export const Test: React.FC<Props> = (props) => {
  const store = useMemo(() => {
    return props.store || createStore();
  }, [props.store]);
  return <App store={store}>{props.children}</App>;
};
