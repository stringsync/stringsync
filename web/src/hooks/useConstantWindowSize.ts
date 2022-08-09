import { useEffect } from 'react';

export const useConstantWindowSize = (width: number, height: number) => {
  useEffect(() => {
    if (width <= 0 || height <= 0) {
      return;
    }
    window.resizeTo(width, height);

    const onResize = (event: UIEvent) => {
      event.preventDefault();
      window.resizeTo(width, height);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [width, height]);
};
