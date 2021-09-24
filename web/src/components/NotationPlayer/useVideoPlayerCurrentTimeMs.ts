import { useEffect, useState } from 'react';
import { VideoJsPlayer } from 'video.js';
import { AsyncLoop } from '../../util/AsyncLoop';
import { Duration } from '../../util/Duration';

const getCurrentTimeMs = (videoPlayer: VideoJsPlayer) => {
  return Duration.sec(videoPlayer.currentTime()).ms;
};

export const useVideoPlayerCurrentTimeMs = (videoPlayer: VideoJsPlayer) => {
  const [currentTimeMs, setCurrentTimeMs] = useState(() => getCurrentTimeMs(videoPlayer));

  useEffect(() => {
    // We don't want to store the currentTimeMs state on the parent NotationPlayer component,
    // since it houses a lot of other components and could potentially trigger a lot of other
    // unwanted updates. We only want components that need the currentTimeMs to update.
    const loop = new AsyncLoop(() => {
      const nextCurrentTimeMs = getCurrentTimeMs(videoPlayer);
      setCurrentTimeMs(nextCurrentTimeMs);
    });
    videoPlayer.ready(() => {
      loop.start();
    });

    return () => {
      loop.stop();
    };
  }, [videoPlayer]);

  return currentTimeMs;
};
