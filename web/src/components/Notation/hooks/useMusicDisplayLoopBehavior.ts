import { useEffect } from 'react';
import { MediaPlayer } from '../../../lib/MediaPlayer';
import { MusicDisplay } from '../../../lib/MusicDisplay';
import { NotationSettings } from '../types';

export const useMusicDisplayLoopBehavior = (
  settings: NotationSettings,
  setSettings: React.Dispatch<React.SetStateAction<NotationSettings>>,
  musicDisplay: MusicDisplay,
  mediaPlayer: MediaPlayer
) => {
  // seek to the beginning of loop if time exceeds loop
  useEffect(() => {
    const mediaPlayerEventBusIds = [
      mediaPlayer.eventBus.subscribe('timechange', (payload) => {
        const loop = musicDisplay.getLoop();
        if (!loop.isActive) {
          return;
        }
        const timeRange = loop.timeRange;
        if (timeRange.contains(payload.time)) {
          return;
        }
        mediaPlayer.seek(timeRange.start);
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...mediaPlayerEventBusIds);
    };
  }, [musicDisplay, mediaPlayer]);

  // sync loop state when settings change
  useEffect(() => {
    const loop = musicDisplay.getLoop();
    if (settings.isLoopActive && !loop.isActive) {
      loop.activate();
    } else if (!settings.isLoopActive && loop.isActive) {
      loop.deactivate();
    }
  }, [musicDisplay, settings.isLoopActive]);

  // sync settings when loop state changes
  useEffect(() => {
    const eventBusIds = [
      musicDisplay.eventBus.subscribe('loopactivated', () => {
        if (!settings.isLoopActive) {
          setSettings({ ...settings, isLoopActive: true });
        }
      }),
      musicDisplay.eventBus.subscribe('loopdeactivated', () => {
        if (settings.isLoopActive) {
          setSettings({ ...settings, isLoopActive: false });
        }
      }),
    ];
    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay, settings, setSettings]);
};
