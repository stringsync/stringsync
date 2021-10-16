import { useEffect, useRef } from 'react';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { SelectionEdge } from '../../lib/MusicDisplay/locator';
import { isCursorSnapshotPointerTarget, isSelectionPointerTarget, isTemporal } from '../../lib/MusicDisplay/pointer';
import { AnchoredSelection } from '../../util/AnchoredSelection';
import * as helpers from './helpers';
import { VideoPlayerControls } from './useVideoPlayerControls';

export const useMusicDisplaySelection = (
  musicDisplay: MusicDisplay | null,
  videoPlayerControls: VideoPlayerControls
) => {
  const selectionRef = useRef<AnchoredSelection | null>(null);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('longpress', (payload) => {
        if (!isCursorSnapshotPointerTarget(payload.src)) {
          return;
        }

        const loop = musicDisplay.getLoop();
        const timeMs = payload.src.timeMs;
        const currentTimeMsRange = loop.timeMsRange;
        const longPressedTimeMsRange = payload.src.cursorSnapshot.getMeasureTimeMsRange();

        if (loop.isActive) {
          const nextTimeMsRange = currentTimeMsRange.contains(timeMs)
            ? longPressedTimeMsRange
            : helpers.extendRanges(currentTimeMsRange, longPressedTimeMsRange);
          loop.update(nextTimeMsRange);
        } else {
          loop.update(longPressedTimeMsRange);
          loop.activate();
        }
      }),
      musicDisplay.eventBus.subscribe('selectionstarted', (payload) => {
        videoPlayerControls.suspend();

        const loop = musicDisplay.getLoop();

        if (isSelectionPointerTarget(payload.src) && loop.isActive) {
          const timeMs = payload.src.edge === SelectionEdge.Start ? loop.timeMsRange.end : loop.timeMsRange.start;
          selectionRef.current = AnchoredSelection.init(timeMs);
          loop.update(selectionRef.current.toRange());
        } else if (isTemporal(payload.src)) {
          selectionRef.current = AnchoredSelection.init(payload.src.timeMs);
          loop.update(selectionRef.current.toRange());
        }

        loop.activate();
      }),
      musicDisplay.eventBus.subscribe('selectionupdated', (payload) => {
        const loop = musicDisplay.getLoop();

        if (isTemporal(payload.dst) && selectionRef.current) {
          selectionRef.current = selectionRef.current.update(payload.dst.timeMs);
          loop.update(selectionRef.current.toRange());
        }
      }),

      musicDisplay.eventBus.subscribe('selectionended', () => {
        selectionRef.current = null;
        videoPlayerControls.unsuspend();
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay, videoPlayerControls]);
};
