import { useEffect } from 'react';
import { MediaPlayer } from '../../../lib/MediaPlayer';
import { MusicDisplay } from '../../../lib/MusicDisplay';
import { isTemporal } from '../../../lib/MusicDisplay/pointer';
import { Duration } from '../../../util/Duration';

export const useMusicDisplayPointerInteractions = (musicDisplay: MusicDisplay, mediaPlayer: MediaPlayer) => {
  useEffect(() => {
    const eventBusIds = [
      musicDisplay.eventBus.subscribe('click', (payload) => {
        musicDisplay.getLoop().deactivate();
        if (!isTemporal(payload.src)) {
          return;
        }
        mediaPlayer.seek(Duration.ms(payload.src.timeMs));
      }),
      musicDisplay.eventBus.subscribe('cursordragstarted', () => {
        mediaPlayer.suspend();
      }),
      musicDisplay.eventBus.subscribe('cursordragupdated', (payload) => {
        if (!isTemporal(payload.dst)) {
          return;
        }
        if (!musicDisplay.getLoop().timeMsRange.contains(payload.dst.timeMs)) {
          musicDisplay.getLoop().deactivate();
        }
        mediaPlayer.seek(Duration.ms(payload.dst.timeMs));
      }),
      musicDisplay.eventBus.subscribe('cursordragended', () => {
        mediaPlayer.unsuspend();
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay, mediaPlayer]);
};
