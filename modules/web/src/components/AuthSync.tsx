import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { useEffectOnce } from '../hooks';
import { authenticate } from '../store';
import { ClientsContext } from '../clients';

export const AuthSync: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const clients = useContext(ClientsContext);
  useEffectOnce(() => {
    dispatch(authenticate({ authClient: clients.authClient, shouldClearAuthOnError: true }));
  });
  return null;
};
