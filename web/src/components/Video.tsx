import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';

const DEFAULT_PLAYER_OPTIONS: videojs.PlayerOptions = {
  controls: true,
  preload: 'auto',
};

type Props = {
  playerOptions: videojs.PlayerOptions;
  onPlayerReady?: (player: videojs.Player) => void;
  beforePlayerDestroy?: (player: videojs.Player) => void;
};

export const Video: React.FC<Props> = (props) => {
  const videoEl = useRef<HTMLVideoElement>(null);

  const video = videoEl.current;
  const { playerOptions, onPlayerReady, beforePlayerDestroy } = props;

  useEffect(() => {
    const video = videoEl.current;
    if (!video) {
      return;
    }

    const player = videojs(video, {
      ...DEFAULT_PLAYER_OPTIONS,
      ...playerOptions,
    });

    player.ready(() => {
      if (onPlayerReady) {
        onPlayerReady(player);
      }
    });

    return () => {
      if (beforePlayerDestroy) {
        beforePlayerDestroy(player);
      }
    };
  }, [video, playerOptions, onPlayerReady, beforePlayerDestroy]);

  return <video className="video-js" ref={videoEl}></video>;
};
