import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { useEffectOnce } from '../hooks';
import { authenticate } from '../store';

export const AuthSync: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffectOnce(() => {
    dispatch(authenticate());
  });
  return null;
};
