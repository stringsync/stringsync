import React from 'react';
import { useDispatch } from 'react-redux';
import { getReauthAction } from '../../store';
import { useEffectOnce } from '../../hooks';

export const AuthenticateOnce: React.FC = () => {
  const dispatch = useDispatch();
  useEffectOnce(() => {
    const reauthAction = getReauthAction();
    dispatch(reauthAction);
  });
  return null;
};
