import { useContext } from 'react';
import { DeviceCtx } from './DeviceCtx';

export const useDevice = () => {
  const state = useContext(DeviceCtx);
  return state;
};
