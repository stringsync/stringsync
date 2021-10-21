import { useEffect } from 'react';

export const useNoOverflow = (element: HTMLElement | null) => {
  useEffect(() => {
    if (!element) {
      return;
    }
    const prevOverflow = element.style.overflow;
    element.style.overflow = 'hidden';
    return () => {
      element.style.overflow = prevOverflow;
    };
  }, [element]);
};
