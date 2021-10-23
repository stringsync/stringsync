import React from 'react';
import { MediaPlayer } from '../../lib/MediaPlayer';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { useMusicDisplayPointerInteractions } from './hooks/useMusicDisplayPointerInteractions';
import { useMusicDisplayRipples } from './hooks/useMusicDisplayRipples';
import { useMusicDisplayScrolling } from './hooks/useMusicDisplayScrolling';
import { NotationSettings } from './types';

type Props = {
  settings: NotationSettings;
  musicDisplay: MusicDisplay;
  mediaPlayer: MediaPlayer;
};

/**
 * A component that runs MusicDisplay and MediaPlayer events.
 *
 * This is an optimization that prevents React from re-rendering and diffing the vdom too much.
 *
 * @param props
 * @returns
 */
export const MusicDisplaySink: React.FC<Props> = (props) => {
  // props
  const settings = props.settings;
  const musicDisplay = props.musicDisplay;
  const mediaPlayer = props.mediaPlayer;

  useMusicDisplayPointerInteractions(musicDisplay, mediaPlayer);
  useMusicDisplayRipples(musicDisplay);
  useMusicDisplayScrolling(settings, musicDisplay, mediaPlayer);

  return null;
};
