import { useEffect } from 'react';
import { OpenSheetMusicDisplay } from '../../lib/MusicDisplay';
import { isTemporal } from '../../lib/MusicDisplay/pointer';
import { VideoPlayerControls } from './useVideoPlayerControls';

export const useMusicDisplayCursorInteractionEffects = (
  musicDisplay: OpenSheetMusicDisplay | null,
  videoPlayerControls: VideoPlayerControls
) => {
  useEffect(() => {
    if (!musicDisplay) {
      return;
    }

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('cursordragstarted', (payload) => {
        videoPlayerControls.suspend();
      }),
      musicDisplay.eventBus.subscribe('cursordragupdated', (payload) => {
        if (!isTemporal(payload.dst)) {
          return;
        }
        if (!musicDisplay.getLoop().timeMsRange.contains(payload.dst.timeMs)) {
          musicDisplay.getLoop().deactivate();
        }
        videoPlayerControls.seek(payload.dst.timeMs);
      }),
      musicDisplay.eventBus.subscribe('cursordragended', (payload) => {
        videoPlayerControls.unsuspend();
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay, videoPlayerControls]);
};
