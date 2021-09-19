import { useCallback, useMemo } from 'react';
import { MusicDisplay } from '../../../lib/MusicDisplay';

export type MusicDisplayScrollControls = {
  startPreferentialScrolling: () => void;
};

export const useMusicDisplayScrollControls = (musicDisplay: MusicDisplay | null, isAutoscrollPreferred: boolean) => {
  const startPreferentialScrolling = useCallback(() => {
    if (!musicDisplay) {
      return;
    }
    if (!isAutoscrollPreferred) {
      return;
    }
    musicDisplay.scroller.startAutoScrolling();
    musicDisplay.cursor.scrollIntoView();
  }, [musicDisplay, isAutoscrollPreferred]);

  return useMemo(() => ({ startPreferentialScrolling }), [startPreferentialScrolling]);
};