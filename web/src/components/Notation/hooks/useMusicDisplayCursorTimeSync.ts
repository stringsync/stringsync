import { useEffect } from 'react';
import { MediaPlayer } from '../../../lib/MediaPlayer';
import { MusicDisplay } from '../../../lib/MusicDisplay';

export const useMusicDisplayCursorTimeSync = (musicDisplay: MusicDisplay, mediaPlayer: MediaPlayer) => {
  useEffect(() => {
    const eventBusIds = [
      mediaPlayer.eventBus.subscribe('timechange', (payload) => {
        musicDisplay.getCursor().update(payload.time.ms);
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...eventBusIds);
    };
  }, [mediaPlayer, musicDisplay]);
};
