import { noop } from 'lodash';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import videojs, { VideoJsPlayer } from 'video.js';
import { useMemoCmp } from '../../hooks/useMemoCmp';
import { Duration } from '../../util/Duration';

const Outer = styled.div``;

type BaseProps = {
  playerOptions: videojs.PlayerOptions;
  onPlayerChange?: (player: VideoJsPlayer | null) => void;
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
  const playerOptions = useMemoCmp(props.playerOptions);
  const onPlayerChange = props.onPlayerChange || noop;

  // creating the videojs player
  const outerRef = useRef<HTMLDivElement>(null);
  const lastTimeDurationRef = useRef(Duration.ms(0));

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) {
      return;
    }

    const media = document.createElement(mode);
    media.setAttribute('playsinline', 'true');
    media.setAttribute('class', 'video-js vjs-default-skin vjs-fill');
    outer.appendChild(media);

    const player = videojs(media, {
      controls: false,
      preload: 'auto',
      fluid: true,
      ...playerOptions,
    });

    player.ready(() => {
      onPlayerChange(player);
      player.currentTime(lastTimeDurationRef.current.sec);
    });

    return () => {
      lastTimeDurationRef.current = Duration.sec(player.currentTime());
      onPlayerChange(null);

      // HACK: prevent the root element from being deleted when disposing the player
      // https://github.com/videojs/video.js/blob/85343d1cec98b59891a650e9d050989424ecf866/src/js/component.js#L167
      (player as any).el_ = null;
      player.dispose();
    };
  }, [playerOptions, mode, onPlayerChange]);

  return <Outer data-vjs-player ref={outerRef} />;
};

const Video: React.FC<Omit<VideoProps, 'mode'>> = (props) => <VideoJs mode="video" {...props} />;
const Audio: React.FC<Omit<AudioProps, 'mode'>> = (props) => <VideoJs mode="audio" {...props} />;
export const Player = { Video, Audio };
