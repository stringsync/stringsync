import { useEffect } from 'react';
import { MediaPlayer } from '../../lib/MediaPlayer';
import { MusicDisplay } from '../../lib/MusicDisplay';

export const useMusicDisplayCursorTimeSync = (musicDisplay: MusicDisplay, mediaPlayer: MediaPlayer) => {
  useEffect(() => {
    const mediaPlayerEventBusIds = [
      mediaPlayer.eventBus.subscribe('timechange', (payload) => {
        musicDisplay.getCursor().update(payload.time.ms);
      }),
    ];
    const musicDisplayEventBusIds = [
      musicDisplay.eventBus.subscribe('loadended', () => {
        const cursor = musicDisplay.getCursor();
        cursor.update(mediaPlayer.getCurrentTime().ms);
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...mediaPlayerEventBusIds);
      musicDisplay.eventBus.unsubscribe(...musicDisplayEventBusIds);
    };
  }, [mediaPlayer, musicDisplay]);
};
