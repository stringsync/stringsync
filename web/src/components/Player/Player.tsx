import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import { useMemoCmp } from '../../hooks/useMemoCmp';
import { MediaPlayer, NoopMediaPlayer, PlayState, VideoJsMediaPlayer } from '../../lib/MediaPlayer';
import { Duration } from '../../util/Duration';

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

  // media player management
  const [mediaPlayer, setMediaPlayer] = useState(() => new NoopMediaPlayer());
  useEffect(() => {
    onPlayerChange(mediaPlayer);
  }, [onPlayerChange, mediaPlayer]);
  const onClick = () => {
    const playState = mediaPlayer.getPlayState();
    switch (playState) {
      case PlayState.Paused:
        mediaPlayer.play();
        break;
      case PlayState.Playing:
        mediaPlayer.pause();
        break;
      default:
        console.warn(`unhandled play state: ${playState}`);
    }
  };

  // creating the videojs player
  const outerRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef(Duration.zero());

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

    const mediaPlayer = new VideoJsMediaPlayer(player);
    setMediaPlayer(mediaPlayer);

    player.ready(() => {
      mediaPlayer.seek(lastTimeRef.current);
    });

    return () => {
      mediaPlayer.pause();
      lastTimeRef.current = mediaPlayer.getCurrentTime();
      mediaPlayer.dispose();

      setMediaPlayer(NOOP_MEDIA_PLAYER);
    };
  }, [playerOptions, mode, onPlayerChange]);

  // vjs dynamically overwrites classnames, so we have to use inline styles instead of styled-components
  return <div data-vjs-player ref={outerRef} style={{ cursor: 'pointer' }} onClick={onClick} />;
};

const Video: React.FC<Omit<VideoProps, 'mode'>> = (props) => <VideoJs mode="video" {...props} />;
const Audio: React.FC<Omit<AudioProps, 'mode'>> = (props) => <VideoJs mode="audio" {...props} />;
export const Player = { Video, Audio };
