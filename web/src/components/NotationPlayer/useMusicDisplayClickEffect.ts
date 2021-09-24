import { useEffect } from 'react';
import { MusicDisplay } from '../../../lib/MusicDisplay';
import { isCursorSnapshotPointerTarget } from '../../../lib/MusicDisplay/pointer/pointerTypeAssert';
import { MusicDisplayScrollControls } from './useMusicDisplayScrollControls';
import { VideoPlayerControls } from './useVideoPlayerControls';

export const useMusicDisplayClickEffect = (
  musicDisplay: MusicDisplay | null,
  videoPlayerControls: VideoPlayerControls,
  musicDisplayScrollControls: MusicDisplayScrollControls
) => {
  useEffect(() => {
    if (!musicDisplay) {
      return;
    }

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('click', (payload) => {
        if (isCursorSnapshotPointerTarget(payload.src)) {
          videoPlayerControls.seek(payload.src.timeMs);
          musicDisplayScrollControls.startPreferentialScrolling();

          if (!musicDisplay.loop.timeMsRange.contains(payload.src.timeMs)) {
            musicDisplay.loop.deactivate();
          }
        } else {
          musicDisplay.loop.deactivate();
        }
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay, videoPlayerControls, musicDisplayScrollControls]);
};
