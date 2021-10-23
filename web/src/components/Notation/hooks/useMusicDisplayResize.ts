import { useEffect, useState } from 'react';
import { MusicDisplay } from '../../../lib/MusicDisplay';

export const useMusicDisplayResize = (musicDisplay: MusicDisplay, width: number) => {
  const [lastResizeWidthPx, setLastResizeWidthPx] = useState(width);

  useEffect(() => {
    if (width === 0) {
      // if there's no width, don't bother resizing
      return;
    }
    if (lastResizeWidthPx === width) {
      return;
    }
    setLastResizeWidthPx(width);
    musicDisplay.resize();
  }, [lastResizeWidthPx, musicDisplay, width]);
};
