import React from 'react';
import { useDynamicScaleSync } from '../hooks/useDynamicScaleSync';
import { useMediaPlayerVolumeBehavior } from '../hooks/useMediaPlayerVolumeBehavior';
import { useMusicDisplayCursorInteractions } from '../hooks/useMusicDisplayCursorInteractions';
import { useMusicDisplayCursorTimeSync } from '../hooks/useMusicDisplayCursorTimeSync';
import { useMusicDisplayLoopBehavior } from '../hooks/useMusicDisplayLoopBehavior';
import { useMusicDisplayPointerInteractions } from '../hooks/useMusicDisplayPointerInteractions';
import { useMusicDisplayRipples } from '../hooks/useMusicDisplayRipples';
import { useMusicDisplayScrolling } from '../hooks/useMusicDisplayScrolling';
import { NotationSettings, SetNotationSettings } from '../hooks/useNotationSettings';
import { MediaPlayer } from '../lib/MediaPlayer';
import { MusicDisplay } from '../lib/MusicDisplay';

type Props = {
  notationSettings: NotationSettings;
  setNotationSettings: SetNotationSettings;
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
  const notationSettings = props.notationSettings;
  const setNotationSettings = props.setNotationSettings;
  const musicDisplay = props.musicDisplay;
  const mediaPlayer = props.mediaPlayer;

  useMusicDisplayPointerInteractions(musicDisplay, mediaPlayer);
  useMusicDisplayRipples(musicDisplay);
  useMusicDisplayScrolling(notationSettings.isAutoscrollPreferred, musicDisplay, mediaPlayer);
  useMusicDisplayLoopBehavior(notationSettings, setNotationSettings, musicDisplay, mediaPlayer);
  useMusicDisplayCursorInteractions(musicDisplay, mediaPlayer);
  useMusicDisplayCursorTimeSync(musicDisplay, mediaPlayer);
  useDynamicScaleSync(notationSettings, setNotationSettings, musicDisplay);
  useMediaPlayerVolumeBehavior(mediaPlayer);

  return null;
};
