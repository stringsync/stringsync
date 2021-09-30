import React, { useCallback, useRef, useState } from 'react';

export const useStateRef = <T>(initialState: T): [T, React.MutableRefObject<T>, (state: T) => void] => {
  const [state, innerSetState] = useState<T>(initialState);
  const ref = useRef<T>(state);

  const setState = useCallback((nextState: T) => {
    ref.current = nextState;
    innerSetState(nextState);
  }, []);

  return [state, ref, setState];
};
