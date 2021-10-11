import { useEffect } from 'react';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { SelectionEdge } from '../../lib/MusicDisplay/locator';
import { isSelectionPointerTarget, isTemporal } from '../../lib/MusicDisplay/pointer/pointerTypeAssert';
import { VideoPlayerControls } from './useVideoPlayerControls';

export const useMusicDisplaySelectionInteractionEffects = (
  musicDisplay: MusicDisplay | null,
  videoPlayerControls: VideoPlayerControls
) => {
  useEffect(() => {
    if (!musicDisplay) {
      return;
    }

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('selectionstarted', (payload) => {
        videoPlayerControls.suspend();

        const loop = musicDisplay.getLoop();
        if (isSelectionPointerTarget(payload.src) && loop.isActive) {
          const nextAnchorValue =
            payload.src.edge === SelectionEdge.Start ? loop.timeMsRange.end : loop.timeMsRange.start;
          loop.anchor(nextAnchorValue);
        } else if (isTemporal(payload.src)) {
          loop.anchor(payload.src.timeMs);
        }

        loop.activate();
      }),

      musicDisplay.eventBus.subscribe('selectionupdated', (payload) => {
        if (isTemporal(payload.dst)) {
          musicDisplay.getLoop().update(payload.dst.timeMs);
        }
      }),

      musicDisplay.eventBus.subscribe('selectionended', () => {
        if (!musicDisplay.getLoop().timeMsRange.contains(musicDisplay.getCursor().timeMs)) {
          videoPlayerControls.seek(musicDisplay.getLoop().timeMsRange.start);
        }
        videoPlayerControls.unsuspend();
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay, videoPlayerControls]);
};
