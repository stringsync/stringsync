import { useEffect, useState } from 'react';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { CursorSnapshot } from '../../lib/MusicDisplay/locator';

export const useMusicDisplayCursorSnapshot = (musicDisplay: MusicDisplay | null) => {
  const [cursorSnapshot, setCursorSnapshot] = useState<CursorSnapshot | null>(() => {
    return musicDisplay ? musicDisplay.getCursor().cursorSnapshot : null;
  });

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    const eventBusId = musicDisplay.eventBus.subscribe('cursorsnapshotchanged', (payload) => {
      setCursorSnapshot(payload.cursorSnapshot);
    });
    return () => {
      musicDisplay.eventBus.unsubscribe(eventBusId);
    };
  }, [musicDisplay]);

  return cursorSnapshot;
};
