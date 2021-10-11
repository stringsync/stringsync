import { useCallback, useMemo } from 'react';
import { MusicDisplay } from '../../lib/MusicDisplay';

export type MusicDisplayScrollControls = {
  startPreferentialScrolling: () => void;
};

export const useMusicDisplayScrollControls = (musicDisplay: MusicDisplay | null, isAutoscrollPreferred: boolean) => {
  const startPreferentialScrolling = useCallback(() => {
    if (!musicDisplay) {
      return;
    }
    if (isAutoscrollPreferred) {
      musicDisplay.getScroller().startAutoScrolling();
      musicDisplay.getCursor().scrollIntoView();
    } else {
      musicDisplay.getScroller().disable();
    }
  }, [musicDisplay, isAutoscrollPreferred]);

  return useMemo(() => ({ startPreferentialScrolling }), [startPreferentialScrolling]);
};
