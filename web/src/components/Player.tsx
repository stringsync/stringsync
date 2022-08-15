import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import { useDevice } from '../ctx/device';
import { useMemoCmp } from '../hooks/useMemoCmp';
import { Quality } from '../hooks/useNotationSettings';
import {
  MediaPlayer,
  NoopMediaPlayer,
  PlayState,
  QualitySelectionStrategy,
  VideoJsMediaPlayer,
} from '../lib/MediaPlayer';

const NOOP_MEDIA_PLAYER = new NoopMediaPlayer();

const noop = (player: MediaPlayer) => {};

type BaseProps = {
  playerOptions: videojs.PlayerOptions;
  onPlayerChange?: (player: MediaPlayer) => void;
  quality: Quality;
};

type VideoProps = BaseProps & {
  mode: 'video';
};

type AudioProps = BaseProps & {
  mode: 'audio';
};

type Props = VideoProps | AudioProps;

const applyQuality = (mediaPlayer: MediaPlayer, quality: Quality) => {
  console.log('asdf');

  const qualityLevels = mediaPlayer.getQualityLevels();
  if (qualityLevels.length === 0) {
    return;
  }

  switch (quality.type) {
    case 'strategy':
      switch (quality.strategy) {
        case QualitySelectionStrategy.Auto:
          mediaPlayer.resetQualityLevels();
          break;
        case QualitySelectionStrategy.Highest:
          const maxHeight = Math.max(...qualityLevels.map((qualityLevel) => qualityLevel.height));
          const maxQualityLevelId = qualityLevels.find((qualityLevel) => qualityLevel.height === maxHeight)!.id;
          mediaPlayer.setQualityLevel(maxQualityLevelId);
          break;
        case QualitySelectionStrategy.Lowest:
          const minHeight = Math.min(...qualityLevels.map((qualityLevel) => qualityLevel.height));
          const minQualityLevelId = qualityLevels.find((qualityLevel) => qualityLevel.height === minHeight)!.id;
          mediaPlayer.setQualityLevel(minQualityLevelId);
          break;
      }
      break;
    case 'specified':
      mediaPlayer.setQualityLevel(quality.level.id);
      break;
  }
};

const VideoJs: React.FC<Props> = (props) => {
  // props
  const mode = props.mode || 'video';
  const playerOptions = useMemoCmp(props.playerOptions);
  const onPlayerChange = props.onPlayerChange || noop;
  const device = useDevice();
  const quality = props.quality;

  // media player management
  const [mediaPlayer, setMediaPlayer] = useState<MediaPlayer>(() => new NoopMediaPlayer());
  useEffect(() => {
    onPlayerChange(mediaPlayer);
  }, [onPlayerChange, mediaPlayer]);
  useEffect(() => {
    applyQuality(mediaPlayer, quality);
    const id = mediaPlayer.eventBus.subscribe('qualitylevelschange', () => {
      applyQuality(mediaPlayer, quality);
    });
    return () => {
      mediaPlayer.eventBus.unsubscribe(id);
    };
  }, [mediaPlayer, quality]);
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
