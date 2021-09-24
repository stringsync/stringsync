import React from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { AppDispatch, setUserAgent } from '../store';

export const DeviceSync: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffectOnce(() => {
    dispatch(setUserAgent(navigator.userAgent));
  });
  return null;
};
