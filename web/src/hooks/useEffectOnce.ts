import { useEffect, EffectCallback } from 'react';

export const useEffectOnce = (callback: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => callback(), []);
};
