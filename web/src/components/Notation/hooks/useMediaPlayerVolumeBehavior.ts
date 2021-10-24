import { useEffect } from 'react';
import { MediaPlayer } from '../../../lib/MediaPlayer';

export const useMediaPlayerVolumeBehavior = (mediaPlayer: MediaPlayer) => {
  useEffect(() => {
    const eventBusIds = [
      mediaPlayer.eventBus.subscribe('init', () => {
        mediaPlayer.setVolume(100);
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...eventBusIds);
    };
  }, [mediaPlayer]);
};
