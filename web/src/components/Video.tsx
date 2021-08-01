import React from 'react';
import videojs, { VideoJsPlayer } from 'video.js';

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
  const videoRef = React.useRef(null);
  const { playerOptions } = props;

  // This seperate functional component fixes the removal of the videoelement
  // from the DOM when calling the dispose() method on a player
  const VideoHtml: React.FC = () => (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );

  React.useEffect(() => {
    const videoElement = videoRef.current;
    let player: VideoJsPlayer;
    if (videoElement) {
      player = videojs(videoElement, { ...DEFAULT_PLAYER_OPTIONS, ...playerOptions }, () => {
        console.log('player is ready');
      });
    }
    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [playerOptions]);

  return <VideoHtml />;
};
