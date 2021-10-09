import { noop } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VideoJsPlayer } from 'video.js';

export enum VideoPlayerState {
  Paused,
  Playing,
}

export type VideoPlayerControls = {
  play: () => void;
  pause: () => void;
  seek: (timeMs: number) => void;
  suspend: () => void;
  unsuspend: () => void;
};

const getVideoPlayerState = (videoPlayer: VideoJsPlayer | null) => (): VideoPlayerState => {
  if (!videoPlayer) {
    return VideoPlayerState.Paused;
    // This awkward if condition is intentional. It assumes not being paused means you are playing.
  } else if (!videoPlayer.paused()) {
    return VideoPlayerState.Playing;
  } else {
    return VideoPlayerState.Paused;
  }
};

export const useVideoPlayerControls = (videoPlayer: VideoJsPlayer | null) => {
  // Unsuspend can be called in the same "render" as a suspend, so we need to store it in a ref so that callers can
  // call unsuspend right after suspend.
  const unsuspendRef = useRef(noop);

  const [videoPlayerState, setVideoPlayerState] = useState(getVideoPlayerState(videoPlayer));
  const [isSuspended, setIsSuspended] = useState(false);

  const play = useCallback(() => {
    videoPlayer && videoPlayer.play();
  }, [videoPlayer]);

  const pause = useCallback(() => {
    videoPlayer && videoPlayer.pause();
  }, [videoPlayer]);

  const suspend = useCallback(() => {
    if (isSuspended) {
      return;
    }
    if (videoPlayerState === VideoPlayerState.Playing) {
      unsuspendRef.current = play;
      pause();
    } else {
      unsuspendRef.current = pause;
    }
    setIsSuspended(true);
  }, [play, pause, videoPlayerState, isSuspended]);

  const unsuspend = useCallback(() => {
    unsuspendRef.current();
    unsuspendRef.current = noop;
    setIsSuspended(false);
  }, []);

  const seek = useCallback(
    (timeMs: number) => {
      videoPlayer && videoPlayer.currentTime(timeMs / 1000);
    },
    [videoPlayer]
  );

  useEffect(() => {
    if (!videoPlayer) {
      return;
    }

    const onPlay = () => setVideoPlayerState(VideoPlayerState.Playing);
    videoPlayer.on('play', onPlay);

    const onPause = () => setVideoPlayerState(VideoPlayerState.Paused);
    videoPlayer.on('pause', onPause);

    return () => {
      videoPlayer.off('pause', onPause);
      videoPlayer.off('play', onPlay);
    };
  }, [videoPlayer]);

  return useMemo(() => ({ play, pause, seek, suspend, unsuspend }), [play, pause, seek, suspend, unsuspend]);
};
