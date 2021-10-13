import { useEffect } from 'react';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { NotationPlayerSettings, NotationPlayerSettingsApi } from './useNotationPlayerSettings';

export const useMusicDisplayLoopSettingSync = (
  musicDisplay: MusicDisplay | null,
  settings: NotationPlayerSettings,
  settingsApi: NotationPlayerSettingsApi
) => {
  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    const loop = musicDisplay.getLoop();
    if (settings.isLoopActive && !loop.isActive) {
      loop.activate();
    } else if (!settings.isLoopActive && loop.isActive) {
      loop.deactivate();
    }
  }, [musicDisplay, settings.isLoopActive]);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    const eventBusIds = [
      musicDisplay.eventBus.subscribe('loopactivated', () => {
        settingsApi.setIsLoopActive(true);
      }),
      musicDisplay.eventBus.subscribe('loopdeactivated', () => {
        settingsApi.setIsLoopActive(false);
      }),
    ];
    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay, settingsApi]);
};
