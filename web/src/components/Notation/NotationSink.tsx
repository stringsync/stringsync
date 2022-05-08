import React from 'react';
import { MediaPlayer } from '../../lib/MediaPlayer';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { NotationSettings } from './types';
import { useDynamicScaleSync } from './useDynamicScaleSync';
import { useMediaPlayerVolumeBehavior } from './useMediaPlayerVolumeBehavior';
import { useMusicDisplayCursorInteractions } from './useMusicDisplayCursorInteractions';
import { useMusicDisplayCursorTimeSync } from './useMusicDisplayCursorTimeSync';
import { useMusicDisplayLoopBehavior } from './useMusicDisplayLoopBehavior';
import { useMusicDisplayPointerInteractions } from './useMusicDisplayPointerInteractions';
import { useMusicDisplayRipples } from './useMusicDisplayRipples';
import { useMusicDisplayScrolling } from './useMusicDisplayScrolling';

type Props = {
  settings: NotationSettings;
  setSettings: React.Dispatch<React.SetStateAction<NotationSettings>>;
  musicDisplay: MusicDisplay;
  mediaPlayer: MediaPlayer;
};

/**
 * A component that runs MusicDisplay and MediaPlayer events.
 *
 * This is an optimization that prevents React from re-rendering and diffing a vdom too much.
 *
 * @param props
 * @returns
 */
export const NotationSink: React.FC<Props> = (props) => {
  // props
  const settings = props.settings;
  const setSettings = props.setSettings;
  const musicDisplay = props.musicDisplay;
  const mediaPlayer = props.mediaPlayer;

  useMusicDisplayPointerInteractions(musicDisplay, mediaPlayer);
  useMusicDisplayRipples(musicDisplay);
  useMusicDisplayScrolling(settings, musicDisplay, mediaPlayer);
  useMusicDisplayLoopBehavior(settings, setSettings, musicDisplay, mediaPlayer);
  useMusicDisplayCursorInteractions(musicDisplay, mediaPlayer);
  useMusicDisplayCursorTimeSync(musicDisplay, mediaPlayer);
  useDynamicScaleSync(settings, setSettings, musicDisplay);
  useMediaPlayerVolumeBehavior(mediaPlayer);

  return null;
};
