import React from 'react';
import { createClients } from './createClients';

export const ClientsContext = React.createContext(createClients());
