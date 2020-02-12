import React from 'react';
import { useDispatch } from 'react-redux';
import { getAuthenticateAction } from '../../store';
import { useEffectOnce } from '../../hooks';

export const AuthenticateOnce: React.FC = () => {
  const dispatch = useDispatch();
  useEffectOnce(() => {
    const authenticateAction = getAuthenticateAction();
    dispatch(authenticateAction);
  });
  return null;
};
