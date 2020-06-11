import React from 'react';
import { useDispatch } from 'react-redux';
import { authenticate } from '../../store';
import { useEffectOnce } from '../../hooks';

export const AuthenticateOnce: React.FC = () => {
  const dispatch = useDispatch();
  useEffectOnce(() => {
    dispatch(authenticate());
  });
  return null;
};
