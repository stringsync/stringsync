import { useEffect, useRef } from 'react';
import { MediaPlayer, PlayState } from '../../../lib/MediaPlayer';
import { MusicDisplay } from '../../../lib/MusicDisplay';
import { isTemporal } from '../../../lib/MusicDisplay/pointer';
import { NotationSettings } from '../types';

export const useMusicDisplayScrolling = (
  settings: NotationSettings,
  musicDisplay: MusicDisplay,
  mediaPlayer: MediaPlayer
) => {
  const isMusicDisplayResizingRef = useRef(false);
  const isMusicDisplayLoadingRef = useRef(false);
  const isAutoscrollPreferred = settings.isAutoscrollPreferred;

  useEffect(() => {
    const startPreferredScrolling = () => {
      if (isAutoscrollPreferred) {
        musicDisplay.getScroller().startAutoScrolling();
        musicDisplay.getCursor().scrollIntoView();
      } else {
        musicDisplay.getScroller().disable();
      }
    };

    const musicDisplayEventBusIds = [
      musicDisplay.eventBus.subscribe('selectionstarted', () => {
        musicDisplay.getScroller().startManualScrolling();
      }),
      musicDisplay.eventBus.subscribe('selectionupdated', (payload) => {
        musicDisplay.getScroller().updateScrollIntent(payload.dst.position.relY);
      }),
      musicDisplay.eventBus.subscribe('selectionended', () => {}),
      musicDisplay.eventBus.subscribe('cursordragstarted', () => {
        musicDisplay.getScroller().startManualScrolling();
      }),
      musicDisplay.eventBus.subscribe('cursordragupdated', (payload) => {
        musicDisplay.getScroller().updateScrollIntent(payload.dst.position.relY);
      }),
      musicDisplay.eventBus.subscribe('cursordragended', (payload) => {
        startPreferredScrolling();
      }),
      musicDisplay.eventBus.subscribe('externalscrolldetected', () => {
        if (isMusicDisplayResizingRef.current) {
          return;
        }
        if (isMusicDisplayLoadingRef.current) {
          return;
        }
        musicDisplay.getScroller().disable();
      }),
      musicDisplay.eventBus.subscribe('resizestarted', () => {
        isMusicDisplayResizingRef.current = true;
      }),
      musicDisplay.eventBus.subscribe('resizeended', () => {
        isMusicDisplayResizingRef.current = false;
      }),
      musicDisplay.eventBus.subscribe('loadstarted', () => {
        isMusicDisplayLoadingRef.current = true;
      }),
      musicDisplay.eventBus.subscribe('loadended', () => {
        isMusicDisplayLoadingRef.current = false;
      }),
      musicDisplay.eventBus.subscribe('measurelinechanged', () => {
        musicDisplay.getCursor().scrollIntoView();
      }),
      musicDisplay.eventBus.subscribe('click', (payload) => {
        if (mediaPlayer.getPlayState() !== PlayState.Playing) {
          return;
        }
        if (!isTemporal(payload.src)) {
          return;
        }
        startPreferredScrolling();
      }),
    ];

    const mediaPlayerEventBusIds = [
      mediaPlayer.eventBus.subscribe('unsuspend', () => {
        startPreferredScrolling();
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...musicDisplayEventBusIds);
      mediaPlayer.eventBus.unsubscribe(...mediaPlayerEventBusIds);
    };
  }, [musicDisplay, mediaPlayer, isAutoscrollPreferred]);
};
