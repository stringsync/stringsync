import { useEffect, useRef } from 'react';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { SelectionEdge } from '../../lib/MusicDisplay/locator';
import {
  isCursorSnapshotPointerTarget,
  isSelectionPointerTarget,
  isTemporal,
} from '../../lib/MusicDisplay/pointer/pointerTypeAssert';
import { AnchoredSelection } from '../../util/AnchoredSelection';
import { NumberRange } from '../../util/NumberRange';
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
        const loop = musicDisplay.getLoop();

        // TODO(jared) Just make this highlight/unlight measures.
        if (isTemporal(payload.src) && loop.isActive) {
          // Change the selection based on the distance from the midpoint

          const timeMs = payload.src.timeMs;
          const timeMsRange = loop.timeMsRange;
          const nextTimeMsRange =
            timeMs < timeMsRange.midpoint
              ? NumberRange.from(timeMs).to(timeMsRange.end)
              : NumberRange.from(timeMsRange.start).to(timeMs);

          loop.update(nextTimeMsRange);
        } else if (isCursorSnapshotPointerTarget(payload.src)) {
          loop.update(payload.src.cursorSnapshot.getMeasureTimeMsRange());
        }

        loop.activate();
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
