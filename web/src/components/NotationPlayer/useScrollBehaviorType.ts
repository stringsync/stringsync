import { useEffect, useState } from 'react';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { ScrollBehaviorType } from '../../lib/MusicDisplay/scroller';

export const useScrollBehaviorType = (musicDisplay: MusicDisplay | null) => {
  const [scrollBehaviorType, setScrollBehaviorType] = useState(() => {
    return musicDisplay ? musicDisplay.getScroller().type : ScrollBehaviorType.Noop;
  });

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    const eventBusIds = [
      musicDisplay.eventBus.subscribe('scrollbehaviorchanged', (payload) => {
        setScrollBehaviorType(payload.type);
      }),
    ];
    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay]);

  return scrollBehaviorType;
};
