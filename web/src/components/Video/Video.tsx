import React, { useEffect, useMemo, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import styled from 'styled-components';
import videojs, { VideoJsPlayer } from 'video.js';

export type Dimensions = {
  heightPx: number;
  widthPx: number;
};

const DEFAULT_PLAYER_OPTIONS: videojs.PlayerOptions = {
  controls: true,
  preload: 'auto',
  fluid: true,
};

const Outer = styled.div``;

type Props = {
  playerOptions: videojs.PlayerOptions;
  onVideoResize?: (widthPx: number, heightPx: number) => void;
  onVideoPlayerChange?: (videoPlayer: VideoJsPlayer | null) => void;
};

export const Video: React.FC<Props> = (props) => {
  const { playerOptions, onVideoResize, onVideoPlayerChange } = props;

  const videoRef = useRef<HTMLVideoElement>(null);
  // We want width and height updated atomically since we know both at the same time.
  const [dimensions, setDimensions] = useState<Dimensions>({ heightPx: 0, widthPx: 0 });

  // This seperate functional component fixes the removal of the videoelement
  // from the DOM when calling the dispose() method on a player
  const VideoHtml = useMemo<React.FC>(
    () => () => (
      <Outer data-vjs-player>
        <video playsInline ref={videoRef} className="video-js vjs-big-play-centered vjs-default-skin vjs-fill" />
      </Outer>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playerOptions]
  );

  useEffect(() => {
    if (onVideoResize) {
      onVideoResize(dimensions.widthPx, dimensions.heightPx);
    }
  }, [dimensions, onVideoResize]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const player = videojs(video, { ...DEFAULT_PLAYER_OPTIONS, ...playerOptions });

    const resizeObserver = new ResizeObserver(() => {
      setDimensions({ widthPx: player.currentWidth(), heightPx: player.currentHeight() });
    });
    resizeObserver.observe(video);

    player.ready(() => {
      if (onVideoPlayerChange) {
        onVideoPlayerChange(player);
      }
    });

    return () => {
      if (onVideoPlayerChange) {
        onVideoPlayerChange(null);
      }

      resizeObserver.disconnect();

      player.dispose();
    };
  }, [playerOptions, onVideoPlayerChange]);

  return <VideoHtml />;
};
