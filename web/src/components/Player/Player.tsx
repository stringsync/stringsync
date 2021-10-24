import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import { useDevice } from '../../ctx/device';
import { useMemoCmp } from '../../hooks/useMemoCmp';
import { MediaPlayer, NoopMediaPlayer, PlayState, VideoJsMediaPlayer } from '../../lib/MediaPlayer';

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
  const device = useDevice();

  // media player management
  const [mediaPlayer, setMediaPlayer] = useState<MediaPlayer>(() => new NoopMediaPlayer());
  useEffect(() => {
    onPlayerChange(mediaPlayer);
    (window as any).mp = mediaPlayer;
  }, [onPlayerChange, mediaPlayer]);
  const onClick = () => {
    if (mediaPlayer.getPlayState() === PlayState.Paused) {
      mediaPlayer.play();
    } else {
      mediaPlayer.pause();
    }
  };

  // creating the videojs player
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) {
      return;
    }

    const media = document.createElement(mode);
    media.setAttribute('playsinline', 'true');
    if (device.mobile) {
      media.setAttribute('autoplay', 'true');
    }
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
      mediaPlayer.pause();
    });

    return () => {
      mediaPlayer.dispose();

      setMediaPlayer(NOOP_MEDIA_PLAYER);
    };
  }, [playerOptions, mode, device]);

  // vjs dynamically overwrites classnames, so we have to use inline styles instead of styled-components
  return <div onClick={onClick} onTouchStart={onClick} data-vjs-player ref={outerRef} style={{ cursor: 'pointer' }} />;
};

const Video: React.FC<Omit<VideoProps, 'mode'>> = (props) => <VideoJs mode="video" {...props} />;
const Audio: React.FC<Omit<AudioProps, 'mode'>> = (props) => <VideoJs mode="audio" {...props} />;
export const Player = { Video, Audio };
