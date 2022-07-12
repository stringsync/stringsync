import { useEffect, useState } from 'react';
import { MediaPlayer } from '../lib/MediaPlayer';

export const useMuted = (mediaPlayer: MediaPlayer) => {
  const [muted, setMuted] = useState(() => mediaPlayer.isMuted());
  useEffect(() => {
    setMuted(mediaPlayer.isMuted());
    const eventBusIds = [
      mediaPlayer.eventBus.subscribe('mutechange', (payload) => {
        setMuted(payload.muted);
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...eventBusIds);
    };
  }, [mediaPlayer]);
  return muted;
};
