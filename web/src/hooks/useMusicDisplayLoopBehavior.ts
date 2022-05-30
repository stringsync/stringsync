import { first } from 'lodash';
import { useEffect, useRef } from 'react';
import { MediaPlayer } from '../lib/MediaPlayer';
import { MusicDisplay } from '../lib/MusicDisplay';
import { SelectionEdge } from '../lib/MusicDisplay/locator';
import { Loop } from '../lib/MusicDisplay/loop';
import { isCursorSnapshotPointerTarget, isSelectionPointerTarget, isTemporal } from '../lib/MusicDisplay/pointer';
import * as notations from '../lib/notations';
import { AnchoredSelection } from '../util/AnchoredSelection';
import { Duration } from '../util/Duration';

const seekToLoopStart = (mediaPlayer: MediaPlayer, loop: Loop) => {
  mediaPlayer.seek(loop.timeRange.start.plus(Duration.ms(1)));
};

export const useMusicDisplayLoopBehavior = (
  settings: notations.NotationSettings,
  setSettings: React.Dispatch<React.SetStateAction<notations.NotationSettings>>,
  musicDisplay: MusicDisplay,
  mediaPlayer: MediaPlayer
) => {
  // ability to make selections
  const selectionRef = useRef<AnchoredSelection | null>(null);
  useEffect(() => {
    const eventBusIds = [
      musicDisplay.eventBus.subscribe('rendered', () => {
        const locator = musicDisplay.getLocator();
        if (!locator) {
          return;
        }

        const loop = musicDisplay.getLoop();
        const firstCursorSnapshot = first(locator.cursorSnapshots);
        if (firstCursorSnapshot) {
          loop.update(firstCursorSnapshot.getMeasureTimeMsRange());
        }
      }),
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
            : notations.extendRanges(currentTimeMsRange, longPressedTimeMsRange);
          loop.update(nextTimeMsRange);
        } else {
          loop.update(longPressedTimeMsRange);
          loop.activate();
        }

        seekToLoopStart(mediaPlayer, loop);
      }),
      musicDisplay.eventBus.subscribe('selectionstarted', (payload) => {
        mediaPlayer.suspend();

        const loop = musicDisplay.getLoop();

        if (isSelectionPointerTarget(payload.src) && loop.isActive) {
          const [anchoredTimeMs, movingTimeMs] =
            payload.src.edge === SelectionEdge.Start
              ? [loop.timeMsRange.end, loop.timeMsRange.start]
              : [loop.timeMsRange.start, loop.timeMsRange.end];
          const selection = AnchoredSelection.init(anchoredTimeMs);
          selectionRef.current = selection.update(movingTimeMs);
          loop.update(selectionRef.current.toRange());
        } else if (isTemporal(payload.src)) {
          selectionRef.current = AnchoredSelection.init(payload.src.timeMs);
          loop.update(selectionRef.current.toRange());
          loop.activate();
        }
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
        const loop = musicDisplay.getLoop();
        seekToLoopStart(mediaPlayer, loop);
        mediaPlayer.unsuspend();
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay, mediaPlayer]);

  // seek to the beginning of loop if time exceeds loop
  useEffect(() => {
    const mediaPlayerEventBusIds = [
      mediaPlayer.eventBus.subscribe('timechange', (payload) => {
        const loop = musicDisplay.getLoop();
        if (!loop.isActive) {
          return;
        }
        const timeRange = loop.timeRange;
        if (timeRange.contains(payload.time)) {
          return;
        }
        mediaPlayer.seek(timeRange.start.plus(Duration.ms(1)));
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...mediaPlayerEventBusIds);
    };
  }, [musicDisplay, mediaPlayer]);

  // sync loop state when settings change
  useEffect(() => {
    const loop = musicDisplay.getLoop();
    if (settings.isLoopActive && !loop.isActive) {
      seekToLoopStart(mediaPlayer, loop);
      loop.activate();
    } else if (!settings.isLoopActive && loop.isActive) {
      loop.deactivate();
    }
  }, [musicDisplay, settings.isLoopActive, mediaPlayer]);

  // sync settings when loop state changes
  useEffect(() => {
    const eventBusIds = [
      musicDisplay.eventBus.subscribe('loopactivated', () => {
        if (!settings.isLoopActive) {
          setSettings({ ...settings, isLoopActive: true });
        }
      }),
      musicDisplay.eventBus.subscribe('loopdeactivated', () => {
        if (settings.isLoopActive) {
          setSettings({ ...settings, isLoopActive: false });
        }
      }),
    ];
    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay, settings, setSettings]);
};
