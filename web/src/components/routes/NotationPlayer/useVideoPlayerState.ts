import { useEffect, useState } from 'react';
import { VideoJsPlayer } from 'video.js';

export enum VideoPlayerState {
  Paused,
  Playing,
}

const getVideoPlayerState = (videoPlayer: VideoJsPlayer): VideoPlayerState => {
  return !videoPlayer.paused() ? VideoPlayerState.Playing : VideoPlayerState.Paused;
};

export const useVideoPlayerState = (videoPlayer: VideoJsPlayer) => {
  const [videoPlayerState, setVideoPlayerState] = useState(() => getVideoPlayerState(videoPlayer));

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

  return videoPlayerState;
};
