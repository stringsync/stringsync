import React from 'react';
import { App } from '../app';
import { createStore, AppStore } from '../store';
import { Clients, createClients } from '../clients';

type Props = {
  store?: AppStore;
  clients?: Partial<Clients>;
};

export const Test: React.FC<Props> = (props) => {
  const store = props.store || createStore();
  const clients = { ...createClients(), ...props.clients };
  return (
    <App store={store} clients={clients}>
      {props.children}
    </App>
  );
};
