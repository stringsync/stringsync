import { useEffect } from 'react';

export const useNoTouchAction = (element: HTMLElement) => {
  useEffect(() => {
    const prevTouchAction = element.style.touchAction;
    element.style.touchAction = 'none';
    return () => {
      element.style.touchAction = prevTouchAction;
    };
  }, [element]);
};
