import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import videojs from 'video.js';

const DEFAULT_PLAYER_OPTIONS: videojs.PlayerOptions = {
  controls: true,
  preload: 'auto',
  fluid: true,
};

const Outer = styled.div``;

type Props = {
  playerOptions: videojs.PlayerOptions;
  onPlayerReady?: (player: videojs.Player) => void;
  beforePlayerDestroy?: (player: videojs.Player) => void;
  onVideoResize?: (widthPx: number, heightPx: number) => void;
  onTimeUpdate?: (timeMs: number) => void;
};

export const Video: React.FC<Props> = (props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { playerOptions, onPlayerReady, beforePlayerDestroy, onVideoResize, onTimeUpdate } = props;

  // This seperate functional component fixes the removal of the videoelement
  // from the DOM when calling the dispose() method on a player
  const VideoHtml: React.FC = () => (
    <Outer data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered vjs-default-skin" />
    </Outer>
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const player = videojs(video, { ...DEFAULT_PLAYER_OPTIONS, ...playerOptions });
    player.ready(() => {
      if (onPlayerReady) {
        onPlayerReady(player);
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      if (onVideoResize) {
        onVideoResize(player.currentWidth(), player.currentHeight());
      }
    });
    resizeObserver.observe(video);

    player.on('timeupdate', () => {
      if (onTimeUpdate) {
        onTimeUpdate(player.currentTime());
      }
    });
    return () => {
      player.off('timeupdate');

      resizeObserver.disconnect();

      if (beforePlayerDestroy) {
        beforePlayerDestroy(player);
      }
      player.dispose();
    };
  }, [playerOptions, onPlayerReady, beforePlayerDestroy, onVideoResize, onTimeUpdate]);

  return <VideoHtml />;
};
