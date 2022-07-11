import { useEffect } from 'react';

export type ResizeCallback = (entries: ResizeObserverEntry[]) => void;

export const useResizeObserver = (id: string, onResize: ResizeCallback) => {
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) {
      return;
    }

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(el);

    return () => {
      resizeObserver.unobserve(el);
      resizeObserver.disconnect();
    };
  }, [id, onResize]);
};
