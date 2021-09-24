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
        musicDisplay.scroller.startManualScrolling();
        if (isSelectionPointerTarget(payload.src)) {
          const timeMsRange = musicDisplay.loop.timeMsRange;
          const newAnchorValue = payload.src.edge === SelectionEdge.Start ? timeMsRange.end : timeMsRange.start;
          musicDisplay.loop.anchor(newAnchorValue);
        } else {
          musicDisplay.loop.anchor(payload.selection.anchorValue);
          musicDisplay.loop.update(payload.selection.movingValue);
        }
        musicDisplay.loop.activate();
      }),

      musicDisplay.eventBus.subscribe('selectionupdated', (payload) => {
        musicDisplay.scroller.updateScrollIntent(payload.dst.position.relY);
        musicDisplay.loop.update(payload.selection.movingValue);
      }),

      musicDisplay.eventBus.subscribe('selectionended', () => {
        if (!musicDisplay.loop.timeMsRange.contains(musicDisplay.cursor.timeMs)) {
          videoPlayerControls.seek(musicDisplay.loop.timeMsRange.start);
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
