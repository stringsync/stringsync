import { useEffect, useRef, DependencyList, EffectCallback } from 'react';

export const useDidMountEffect = (effect: EffectCallback, deps: DependencyList) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      return effect();
    } else {
      didMount.current = true;
    }
  }, [effect]);
};
