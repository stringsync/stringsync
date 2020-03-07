import React from 'react';
import { StringSyncClient } from './types';
import { ClientContext } from './ClientContext';

interface Props {
  client: StringSyncClient;
}

export const ClientProvider: React.FC<Props> = (props) => {
  return (
    <ClientContext.Provider value={props.client}>
      {props.children}
    </ClientContext.Provider>
  );
};
