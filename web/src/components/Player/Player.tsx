import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import videojs from 'video.js';
import { useMemoCmp } from '../../hooks/useMemoCmp';
import { MediaPlayer, NoopMediaPlayer, VideoJsMediaPlayer } from '../../lib/MediaPlayer';
import { Duration } from '../../util/Duration';

const Outer = styled.div``;

const NOOP_MEDIA_PLAYER = new NoopMediaPlayer();

const noop = (player: MediaPlayer) => {};

type BaseProps = {
  playerOptions: videojs.PlayerOptions;
  onPlayerChange?: (player: MediaPlayer) => void;
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
  const lastTimeRef = useRef(Duration.zero());

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) {
      onPlayerChange(NOOP_MEDIA_PLAYER);
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

    const mediaPlayer = new VideoJsMediaPlayer(player);

    player.ready(() => {
      onPlayerChange(mediaPlayer);
      player.currentTime(lastTimeRef.current.sec);
    });

    return () => {
      lastTimeRef.current = mediaPlayer.getCurrentTime();
      mediaPlayer.dispose();
      onPlayerChange(NOOP_MEDIA_PLAYER);

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
