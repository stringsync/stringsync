import { noop } from '@babel/types';
import React, { useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import styled from 'styled-components';
import videojs, { VideoJsPlayer } from 'video.js';
import { Duration } from '../../util/Duration';

type Mode = 'video' | 'audio';

export type Dimensions = {
  height: number;
  width: number;
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

type BaseProps = {
  playerOptions: videojs.PlayerOptions;
  onPlayerChange?: (player: VideoJsPlayer | null) => void;
  onResize?: (dimensions: Dimensions) => void;
};

type VideoProps = BaseProps & {
  mode: 'video';
};

type AudioProps = BaseProps & {
  mode: 'audio';
};

type Props = VideoProps | AudioProps;

const VideoJs: React.FC<Props> = (props) => {
  // props
  const mode = props.mode || 'video';
  const playerOptions = props.playerOptions;
  const onPlayerChange = props.onPlayerChange || noop;
  const onResize = props.onResize || noop;

  // dimensions management
  const [dimensions, setDimensions] = useState<Dimensions>({ height: 0, width: 0 });

  useEffect(() => {
    onResize(dimensions);
  }, [dimensions, onResize]);

  useEffect(() => {
    if (mode === 'audio') {
      setDimensions({ height: 0, width: 0 });
    }
  }, [mode]);

  // creating the videojs player
  const divRef = useRef<HTMLDivElement>(null);
  const lastTimeDurationRef = useRef(Duration.ms(0));

  useEffect(() => {
    const div = divRef.current;
    if (!div) {
      return;
    }

    // React shouldn't know about these elements because player.dispose will remove them from the dom.
    // https://github.com/videojs/video.js/blob/85343d1cec98b59891a650e9d050989424ecf866/src/js/player.js#L563
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
      setDimensions({ width: player.currentWidth(), height: player.currentHeight() });
    });
    resizeObserver.observe(media);

    player.ready(() => {
      onPlayerChange(player);
      player.currentTime(lastTimeDurationRef.current.sec);
      setDimensions({ width: player.currentWidth(), height: player.currentHeight() });
    });

    return () => {
      lastTimeDurationRef.current = Duration.sec(player.currentTime());
      onPlayerChange(null);
      resizeObserver.disconnect();
      player.dispose();
    };
  }, [playerOptions, mode, onPlayerChange]);

  return <Outer data-vjs-player ref={divRef} />;
};

const Video: React.FC<Omit<VideoProps, 'mode'>> = (props) => <VideoJs mode="video" {...props} />;
const Audio: React.FC<Omit<AudioProps, 'mode'>> = (props) => <VideoJs mode="audio" {...props} />;
export const Player = { Video, Audio };
