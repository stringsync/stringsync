import React, { useEffect, useMemo, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import styled from 'styled-components';
import videojs from 'video.js';

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
  onTimeUpdate?: (timeMs: number) => void;
};

export const Video: React.FC<Props> = (props) => {
  const { playerOptions, onVideoResize, onTimeUpdate } = props;

  const videoRef = useRef<HTMLVideoElement>(null);
  // We want width and height updated atomically since we know both at the same time.
  const [dimensions, setDimensions] = useState<Dimensions>({ heightPx: 0, widthPx: 0 });
  const [timeMs, setTimeMs] = useState(0);

  // This seperate functional component fixes the removal of the videoelement
  // from the DOM when calling the dispose() method on a player
  const VideoHtml = useMemo<React.FC>(
    () => () => (
      <Outer data-vjs-player>
        <video ref={videoRef} className="video-js vjs-big-play-centered vjs-default-skin vjs-fill" />
      </Outer>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playerOptions]
  );

  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(timeMs);
    }
  }, [timeMs, onTimeUpdate]);

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

    // The timeupdate event fires too slowly for animating smoothly.
    let rafHandle = 0;
    const updateCurrentTime = () => {
      setTimeMs(player.currentTime() * 1000);
      rafHandle = window.requestAnimationFrame(updateCurrentTime);
    };

    player.ready(() => {
      updateCurrentTime();
    });

    return () => {
      window.cancelAnimationFrame(rafHandle);

      resizeObserver.disconnect();

      player.dispose();
    };
  }, [playerOptions]);

  return <VideoHtml />;
};
