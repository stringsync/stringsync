import { useContext } from 'react';
import { ServiceWorkerCtx } from './ServiceWorkerCtx';

export const useServiceWorker = () => {
  const state = useContext(ServiceWorkerCtx);
  return state;
};
