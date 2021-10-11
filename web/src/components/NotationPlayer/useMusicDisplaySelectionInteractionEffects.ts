import { useEffect } from 'react';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { SelectionEdge } from '../../lib/MusicDisplay/locator';
import { isSelectionPointerTarget } from '../../lib/MusicDisplay/pointer/pointerTypeAssert';
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
        if (isSelectionPointerTarget(payload.src)) {
          const timeMsRange = musicDisplay.getLoop().timeMsRange;
          const nextAnchorValue = payload.src.edge === SelectionEdge.Start ? timeMsRange.end : timeMsRange.start;
          musicDisplay.getLoop().anchor(nextAnchorValue);
        } else {
          musicDisplay.getLoop().anchor(payload.selection.anchorValue);
        }
        musicDisplay.getLoop().activate();
      }),

      musicDisplay.eventBus.subscribe('selectionupdated', (payload) => {
        musicDisplay.getLoop().update(payload.selection.movingValue);
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
