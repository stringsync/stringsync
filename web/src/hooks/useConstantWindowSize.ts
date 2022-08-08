import { useEffect } from 'react';

export const useConstantWindowSize = (width: number, height: number) => {
  useEffect(() => {
    if (width <= 0 || height <= 0) {
      return;
    }

    const onResize = (event: UIEvent) => {
      event.preventDefault();
      document.body.setAttribute('width', `${width}px`);
      document.body.setAttribute('height', `${height}px`);
    };

    document.body.addEventListener('resize', onResize);
    return () => {
      document.body.removeEventListener('resize', onResize);
    };
  }, [width, height]);
};
