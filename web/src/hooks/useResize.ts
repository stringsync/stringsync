import { useEffect } from 'react';

type Callback = (event: UIEvent) => any;

export const useResize = (callback: Callback) => {
  useEffect(() => {
    window.addEventListener('resize', callback);
    return () => {
      window.addEventListener('resize', callback);
    };
  }, [callback]);
};
