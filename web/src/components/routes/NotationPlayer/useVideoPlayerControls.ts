import { noop } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { VideoJsPlayer } from 'video.js';

export enum VideoPlayerState {
  Paused,
  Playing,
}

const getVideoPlayerState = (videoPlayer: VideoJsPlayer) => (): VideoPlayerState => {
  return !videoPlayer.paused() ? VideoPlayerState.Playing : VideoPlayerState.Paused;
};

export const useVideoPlayerControls = (videoPlayer: VideoJsPlayer) => {
  // Unsuspend can be called in the same "render" as a suspend, so we need to store it in a ref so that callers can
  // call unsuspend right after suspend.
  const unsuspendRef = useRef(noop);

  const [videoPlayerState, setVideoPlayerState] = useState(getVideoPlayerState(videoPlayer));
  const [isSuspended, setIsSuspended] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);

  const play = useCallback(() => {
    videoPlayer.play();
  }, [videoPlayer]);

  const pause = useCallback(() => {
    videoPlayer.pause();
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
      videoPlayer.currentTime(timeMs / 1000);
    },
    [videoPlayer]
  );

  useEffect(() => {
    const onPlay = () => setVideoPlayerState(VideoPlayerState.Playing);
    videoPlayer.on('play', onPlay);

    const onPause = () => setVideoPlayerState(VideoPlayerState.Paused);
    videoPlayer.on('pause', onPause);

    return () => {
      videoPlayer.off('pause', onPause);
      videoPlayer.off('play', onPlay);
    };
  }, [videoPlayer]);

  useEffect(() => {
    // We don't want to store the currentTimeMs state on the parent NotationPlayer component,
    // since it houses a lot of other components and could potentially trigger a lot of other
    // unwanted updates. We only want components that need the currentTimeMs to update.
    let rafHandle = 0;
    const updateCurrentTimeMs = () => {
      try {
        const timeSec = videoPlayer.currentTime();
        const timeMs = timeSec * 1000;
        setCurrentTimeMs(timeMs);
      } finally {
        rafHandle = window.requestAnimationFrame(updateCurrentTimeMs);
      }
    };
    updateCurrentTimeMs();

    return () => {
      cancelAnimationFrame(rafHandle);
    };
  }, [videoPlayer]);

  return {
    videoPlayerState,
    currentTimeMs,
    play,
    pause,
    seek,
    suspend,
    unsuspend,
  };
};
