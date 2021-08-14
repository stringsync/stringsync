import React from 'react';
import styled from 'styled-components';
import videojs, { VideoJsPlayer } from 'video.js';

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
};

export const Video: React.FC<Props> = (props) => {
  const videoRef = React.useRef(null);
  const { playerOptions, onPlayerReady, beforePlayerDestroy } = props;

  // This seperate functional component fixes the removal of the videoelement
  // from the DOM when calling the dispose() method on a player
  const VideoHtml: React.FC = () => (
    <Outer data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered vjs-default-skin" />
    </Outer>
  );

  React.useEffect(() => {
    const video = videoRef.current;
    let player: VideoJsPlayer;
    if (video) {
      player = videojs(video, { ...DEFAULT_PLAYER_OPTIONS, ...playerOptions });

      player.ready(() => {
        if (onPlayerReady) {
          onPlayerReady(player);
        }
      });
    }
    return () => {
      if (!player) {
        return;
      }
      if (beforePlayerDestroy) {
        beforePlayerDestroy(player);
      }
      player.dispose();
    };
  }, [playerOptions, onPlayerReady, beforePlayerDestroy]);

  return <VideoHtml />;
};
