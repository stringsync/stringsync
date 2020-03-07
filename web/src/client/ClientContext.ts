import React from 'react';
import { Client } from './Client';
import { StringSyncClient } from './types';

export const ClientContext = React.createContext<StringSyncClient>(
  Client.create(Client.NULL_URI)
);
