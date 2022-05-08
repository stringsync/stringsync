import { useEffect, useState } from 'react';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { CursorSnapshot } from '../../lib/MusicDisplay/locator';

export const useMusicDisplayCursorSnapshot = (musicDisplay: MusicDisplay) => {
  const [cursorSnapshot, setCursorSnapshot] = useState<CursorSnapshot | null>(() => {
    return musicDisplay.getCursor().cursorSnapshot;
  });

  useEffect(() => {
    const eventBusId = musicDisplay.eventBus.subscribe('cursorsnapshotchanged', (payload) => {
      setCursorSnapshot(payload.cursorSnapshot);
    });
    return () => {
      musicDisplay.eventBus.unsubscribe(eventBusId);
    };
  }, [musicDisplay]);

  return cursorSnapshot;
};
