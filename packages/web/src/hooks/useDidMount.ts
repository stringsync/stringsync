import { useRef } from 'react';
import { useEffectOnce } from './useEffectOnce';

export const useDidMount = (): boolean => {
  const didMount = useRef(false);

  useEffectOnce(() => {
    didMount.current = true;
  });

  return didMount.current;
};
