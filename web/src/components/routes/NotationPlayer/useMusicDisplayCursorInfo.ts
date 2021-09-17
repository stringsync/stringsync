import { useEffect, useState } from 'react';
import { MusicDisplay } from '../../../lib/MusicDisplay';
import { CursorInfo } from '../../../lib/MusicDisplay/cursors';

export const useMusicDisplayCursorInfo = (musicDisplay: MusicDisplay | null) => {
  const [cursorInfo, setCursorInfo] = useState<CursorInfo>({
    currentMeasureIndex: 0,
    currentMeasureNumber: 1,
    numMeasures: 0,
  });

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    musicDisplay.eventBus.subscribe('cursorinfochanged', (payload) => {
      setCursorInfo(payload.info);
    });
  }, [musicDisplay]);

  return cursorInfo;
};
