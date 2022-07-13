import { useCallback, useEffect, useState } from 'react';
import { MediaPlayer } from '../lib/MediaPlayer';

export const useMute = (mediaPlayer: MediaPlayer): [muted: boolean, toggleMute: () => void] => {
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

  const toggleMute = useCallback(() => {
    if (mediaPlayer.isMuted()) {
      mediaPlayer.unmute();
    } else {
      mediaPlayer.mute();
    }
  }, [mediaPlayer]);

  return [muted, toggleMute];
};
