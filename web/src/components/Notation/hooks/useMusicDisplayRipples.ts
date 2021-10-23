import { useEffect } from 'react';
import { MusicDisplay } from '../../../lib/MusicDisplay';
import { isNonePointerTarget, isPositional } from '../../../lib/MusicDisplay/pointer';

export const useMusicDisplayRipples = (musicDisplay: MusicDisplay) => {
  useEffect(() => {
    const eventBusIds = [
      musicDisplay.eventBus.subscribe('pointerdown', (payload) => {
        if (isNonePointerTarget(payload.src)) {
          return;
        }
        if (!isPositional(payload.src)) {
          return;
        }
        const { x, y } = payload.src.position;
        musicDisplay.getFx().ripple(x, y);
      }),
      musicDisplay.eventBus.subscribe('longpress', (payload) => {
        if (isNonePointerTarget(payload.src)) {
          return;
        }
        if (!isPositional(payload.src)) {
          return;
        }
        const { x, y } = payload.src.position;
        musicDisplay.getFx().bigRipple(x, y);
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay]);
};
