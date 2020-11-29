import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, setUserAgent } from '../store';
import { useEffectOnce } from '../hooks';

export const DeviceSync: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffectOnce(() => {
    dispatch(setUserAgent(navigator.userAgent));
  });
  return null;
};
