import { useEffect } from 'react';

export const useNoOverflow = (element: HTMLElement) => {
  useEffect(() => {
    const prevOverflow = element.style.overflow;
    element.style.overflow = 'hidden';
    return () => {
      element.style.overflow = prevOverflow;
    };
  }, [element]);
};
