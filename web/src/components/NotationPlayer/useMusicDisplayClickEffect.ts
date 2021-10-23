import { useEffect } from 'react';
import { OpenSheetMusicDisplay } from '../../lib/MusicDisplay';
import { isTemporal } from '../../lib/MusicDisplay/pointer';
import { VideoPlayerControls } from './useVideoPlayerControls';

export const useMusicDisplayClickEffect = (
  musicDisplay: OpenSheetMusicDisplay | null,
  videoPlayerControls: VideoPlayerControls
) => {
  useEffect(() => {
    if (!musicDisplay) {
      return;
    }

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('click', (payload) => {
        musicDisplay.getLoop().deactivate();
        if (!isTemporal(payload.src)) {
          return;
        }
        videoPlayerControls.seek(payload.src.timeMs);
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay, videoPlayerControls]);
};
