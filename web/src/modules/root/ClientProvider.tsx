import React from 'react';
import { ClientContext, StringSyncClient } from '../../client';

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
