import { useEffect } from 'react';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { isTemporal } from '../../lib/MusicDisplay/pointer/pointerTypeAssert';
import { VideoPlayerControls } from './useVideoPlayerControls';

export const useMusicDisplayClickEffect = (
  musicDisplay: MusicDisplay | null,
  videoPlayerControls: VideoPlayerControls
) => {
  useEffect(() => {
    if (!musicDisplay) {
      return;
    }

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('click', (payload) => {
        if (!isTemporal(payload.src)) {
          return;
        }
        videoPlayerControls.seek(payload.src.timeMs);

        const loop = musicDisplay.getLoop();
        if (loop.isActive && !loop.timeMsRange.contains(payload.src.timeMs)) {
          musicDisplay.getLoop().deactivate();
        }
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay, videoPlayerControls]);
};
