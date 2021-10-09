import { useEffect, useState } from 'react';
import { VideoJsPlayer } from 'video.js';

export enum VideoPlayerState {
  Paused,
  Playing,
}

const getVideoPlayerState = (videoPlayer: VideoJsPlayer | null): VideoPlayerState => {
  if (videoPlayer) {
    return !videoPlayer.paused() ? VideoPlayerState.Playing : VideoPlayerState.Paused;
  }
  return VideoPlayerState.Paused;
};

export const useVideoPlayerState = (videoPlayer: VideoJsPlayer | null) => {
  const [videoPlayerState, setVideoPlayerState] = useState(() => getVideoPlayerState(videoPlayer));

  useEffect(() => {
    setVideoPlayerState(getVideoPlayerState(videoPlayer));
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

  return videoPlayerState;
};
