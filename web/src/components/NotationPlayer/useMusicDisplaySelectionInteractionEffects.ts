import { useEffect } from 'react';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { SelectionEdge } from '../../lib/MusicDisplay/locator';
import { isSelectionPointerTarget } from '../../lib/MusicDisplay/pointer/pointerTypeAssert';
import { MusicDisplayScrollControls } from './useMusicDisplayScrollControls';
import { VideoPlayerControls } from './useVideoPlayerControls';

export const useMusicDisplaySelectionInteractionEffects = (
  musicDisplay: MusicDisplay | null,
  videoPlayerControls: VideoPlayerControls,
  scrollControls: MusicDisplayScrollControls
) => {
  useEffect(() => {
    if (!musicDisplay) {
      return;
    }

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('selectionstarted', (payload) => {
        videoPlayerControls.suspend();
        musicDisplay.getScroller().startManualScrolling();
        if (isSelectionPointerTarget(payload.src)) {
          const timeMsRange = musicDisplay.getLoop().timeMsRange;
          const newAnchorValue = payload.src.edge === SelectionEdge.Start ? timeMsRange.end : timeMsRange.start;
          musicDisplay.getLoop().anchor(newAnchorValue);
        } else {
          musicDisplay.getLoop().anchor(payload.selection.anchorValue);
          musicDisplay.getLoop().update(payload.selection.movingValue);
        }
        musicDisplay.getLoop().activate();
      }),

      musicDisplay.eventBus.subscribe('selectionupdated', (payload) => {
        musicDisplay.getScroller().updateScrollIntent(payload.dst.position.relY);
        musicDisplay.getLoop().update(payload.selection.movingValue);
      }),

      musicDisplay.eventBus.subscribe('selectionended', () => {
        if (!musicDisplay.getLoop().timeMsRange.contains(musicDisplay.getCursor().timeMs)) {
          videoPlayerControls.seek(musicDisplay.getLoop().timeMsRange.start);
        }
        scrollControls.startPreferentialScrolling();
        videoPlayerControls.unsuspend();
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay, videoPlayerControls, scrollControls]);
};
