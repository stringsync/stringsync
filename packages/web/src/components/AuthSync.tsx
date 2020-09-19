import React from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from '../hooks';
import { AppDispatch, authenticate } from '../store';

export const AuthSync: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffectOnce(() => {
    dispatch(authenticate({ shouldClearAuthOnError: true }));
  });
  return null;
};
