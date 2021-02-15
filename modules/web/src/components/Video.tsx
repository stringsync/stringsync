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
  const videoEl = useRef(null);

  useEffect(() => {
    const video = videoEl.current;
    if (!video) {
      return;
    }

    const player = videojs(video, {
      ...DEFAULT_PLAYER_OPTIONS,
      ...props.playerOptions,
    });

    player.ready(() => {
      if (props.onPlayerReady) {
        props.onPlayerReady(player);
      }
    });

    return () => {
      if (props.beforePlayerDestroy) {
        props.beforePlayerDestroy(player);
      }
      player.dispose();
    };
  }, [props, videoEl]);

  return <video className="video-js" ref={videoEl}></video>;
};
