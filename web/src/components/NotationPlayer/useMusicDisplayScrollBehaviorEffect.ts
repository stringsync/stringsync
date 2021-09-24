import { useEffect, useRef } from 'react';
import { MusicDisplay } from '../../../lib/MusicDisplay';

export const useMusicDisplayScrollBehaviorEffect = (musicDisplay: MusicDisplay | null) => {
  const isMusicDisplayResizingRef = useRef(false);
  const isMusicDisplayLoadingRef = useRef(false);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    const eventBusIds = [
      musicDisplay.eventBus.subscribe('externalscrolldetected', () => {
        if (isMusicDisplayResizingRef.current) {
          return;
        }
        if (isMusicDisplayLoadingRef.current) {
          return;
        }
        musicDisplay.scroller.disable();
      }),
      musicDisplay.eventBus.subscribe('resizestarted', () => {
        isMusicDisplayResizingRef.current = true;
      }),
      musicDisplay.eventBus.subscribe('resizeended', () => {
        isMusicDisplayResizingRef.current = false;
      }),
      musicDisplay.eventBus.subscribe('loadstarted', () => {
        isMusicDisplayLoadingRef.current = true;
      }),
      musicDisplay.eventBus.subscribe('loadended', () => {
        isMusicDisplayLoadingRef.current = false;
      }),
      musicDisplay.eventBus.subscribe('measurelinechanged', () => {
        musicDisplay.cursor.scrollIntoView();
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay]);
};
