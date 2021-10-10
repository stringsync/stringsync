import React, { useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import styled from 'styled-components';
import videojs, { VideoJsPlayer } from 'video.js';
import { Duration } from '../../util/Duration';

type Mode = 'video' | 'audio';

export type Dimensions = {
  heightPx: number;
  widthPx: number;
};

const getPlayerOptions = (mode: Mode): videojs.PlayerOptions => {
  switch (mode) {
    case 'audio':
      return {
        controls: false,
        preload: 'auto',
        fluid: false,
      };
    case 'video':
      return {
        controls: true,
        preload: 'auto',
        fluid: true,
      };
    default:
      return {};
  }
};

const Outer = styled.div``;

type Props = {
  playerOptions: videojs.PlayerOptions;
  mode?: Mode;
  onVideoResize?: (widthPx: number, heightPx: number) => void;
  onVideoPlayerChange?: (videoPlayer: VideoJsPlayer | null) => void;
};

export const Video: React.FC<Props> = (props) => {
  const mode = props.mode || 'video';
  const { playerOptions, onVideoResize, onVideoPlayerChange } = props;

  const divRef = useRef<HTMLDivElement>(null);
  const lastTimeDurationRef = useRef(Duration.ms(0));
  // We want width and height updated atomically since we know both at the same time.
  const [dimensions, setDimensions] = useState<Dimensions>({ heightPx: 0, widthPx: 0 });

  useEffect(() => {
    if (onVideoResize) {
      onVideoResize(dimensions.widthPx, dimensions.heightPx);
    }
  }, [dimensions, onVideoResize]);

  useEffect(() => {
    const div = divRef.current;
    if (!div) {
      return;
    }

    // React shouldn't know about these elements because player.dispose will remove them from the dom.
    // https://github.com/videojs/video.js/blob/master/src/js/player.js#L563
    const container = document.createElement('div');
    const media = document.createElement(mode);
    media.setAttribute('playsinline', 'true');
    if (mode === 'audio') {
      media.setAttribute('class', 'video-js vjs-default-skin vjs-fill');
    } else if (mode === 'video') {
      media.setAttribute('class', 'video-js vjs-big-play-centered vjs-default-skin vjs-fill');
    }
    container.appendChild(media);
    div.appendChild(container);

    const player = videojs(media, { ...getPlayerOptions(mode), ...playerOptions });

    const resizeObserver = new ResizeObserver(() => {
      setDimensions({ widthPx: player.currentWidth(), heightPx: player.currentHeight() });
    });
    resizeObserver.observe(media);

    player.ready(() => {
      if (onVideoPlayerChange) {
        onVideoPlayerChange(player);
      }
      player.currentTime(lastTimeDurationRef.current.sec);
      setDimensions({ widthPx: player.currentWidth(), heightPx: player.currentHeight() });
    });

    return () => {
      lastTimeDurationRef.current = Duration.sec(player.currentTime());
      if (onVideoPlayerChange) {
        onVideoPlayerChange(null);
      }
      resizeObserver.disconnect();
      player.dispose();
    };
  }, [playerOptions, mode, onVideoPlayerChange]);

  return <Outer data-vjs-player ref={divRef} />;
};
