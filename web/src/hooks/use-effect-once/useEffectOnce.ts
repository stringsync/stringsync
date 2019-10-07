import { useEffect, EffectCallback } from 'react';

const useEffectOnce = (callback: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => callback(), []);
};

export default useEffectOnce;
