import { useContext } from 'react';
import { ClientContext } from '../client';

export const useClient = () => useContext(ClientContext);
