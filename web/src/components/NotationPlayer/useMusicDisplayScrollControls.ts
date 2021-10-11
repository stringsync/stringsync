import { useMemo } from 'react';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { NotationPlayerSettings } from './useNotationPlayerSettings';

export const useMusicDisplayScrollControls = (musicDisplay: MusicDisplay | null, settings: NotationPlayerSettings) => {
  return useMemo(() => {
    return {
      startPreferredScrolling: () => {
        if (!musicDisplay) {
          return;
        }
        if (settings.isAutoscrollPreferred) {
          musicDisplay.getScroller().startAutoScrolling();
          musicDisplay.getCursor().scrollIntoView();
        } else {
          musicDisplay.getScroller().disable();
        }
      },
    };
  }, [musicDisplay, settings.isAutoscrollPreferred]);
};
