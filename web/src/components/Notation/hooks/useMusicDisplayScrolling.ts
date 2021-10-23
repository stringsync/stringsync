import { message } from 'antd';
import { useEffect, useRef } from 'react';
import { MediaPlayer, PlayState } from '../../../lib/MediaPlayer';
import { MusicDisplay } from '../../../lib/MusicDisplay';
import { isTemporal } from '../../../lib/MusicDisplay/pointer';
import { ScrollBehaviorType } from '../../../lib/MusicDisplay/scroller';
import { NotationSettings } from '../types';

const SCROLL_DIVERGENCE_KEY = 'SCROLL_DIVERGENCE_KEY';

const startPreferredScrolling = (musicDisplay: MusicDisplay, isAutoscrollPreferred: boolean) => {
  if (isAutoscrollPreferred) {
    musicDisplay.getScroller().startAutoScrolling();
    musicDisplay.getCursor().scrollIntoView();
  } else {
    musicDisplay.getScroller().disable();
  }
};

export const useMusicDisplayScrolling = (
  settings: NotationSettings,
  musicDisplay: MusicDisplay,
  mediaPlayer: MediaPlayer
) => {
  const isMusicDisplayResizingRef = useRef(false);
  const isMusicDisplayLoadingRef = useRef(false);
  const isAutoscrollPreferred = settings.isAutoscrollPreferred;

  useEffect(() => {
    startPreferredScrolling(musicDisplay, isAutoscrollPreferred);
  }, [musicDisplay, isAutoscrollPreferred]);

  useEffect(() => {
    const onScrollBehaviorChange = (scrollBehaviorType: ScrollBehaviorType) => {
      message.destroy(SCROLL_DIVERGENCE_KEY);
      if (scrollBehaviorType !== ScrollBehaviorType.Noop) {
        return;
      }
      if (mediaPlayer.getPlayState() !== PlayState.Playing) {
        return;
      }
      if (!isAutoscrollPreferred) {
        return;
      }
      message.warn({
        key: SCROLL_DIVERGENCE_KEY,
        duration: null,
        content: 'tap to autoscroll',
        onClick: () => {
          startPreferredScrolling(musicDisplay, isAutoscrollPreferred);
        },
      });
    };

    onScrollBehaviorChange(musicDisplay.getScroller().type);

    const musicDisplayEventBusIds = [
      musicDisplay.eventBus.subscribe('scrollbehaviorchanged', (payload) => {
        onScrollBehaviorChange(payload.type);
      }),
    ];
    const mediaPlayerEventBusIds = [
      mediaPlayer.eventBus.subscribe('pause', () => {
        message.destroy(SCROLL_DIVERGENCE_KEY);
      }),
    ];
    return () => {
      musicDisplay.eventBus.unsubscribe(...musicDisplayEventBusIds);
      mediaPlayer.eventBus.unsubscribe(...mediaPlayerEventBusIds);
    };
  }, [isAutoscrollPreferred, musicDisplay, mediaPlayer]);

  useEffect(() => {
    const eventBusIds = [
      mediaPlayer.eventBus.subscribe('play', () => {
        startPreferredScrolling(musicDisplay, isAutoscrollPreferred);
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...eventBusIds);
    };
  }, [isAutoscrollPreferred, musicDisplay, mediaPlayer]);

  useEffect(() => {
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
        startPreferredScrolling(musicDisplay, isAutoscrollPreferred);
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
        startPreferredScrolling(musicDisplay, isAutoscrollPreferred);
      }),
    ];

    const mediaPlayerEventBusIds = [
      mediaPlayer.eventBus.subscribe('unsuspend', () => {
        startPreferredScrolling(musicDisplay, isAutoscrollPreferred);
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...musicDisplayEventBusIds);
      mediaPlayer.eventBus.unsubscribe(...mediaPlayerEventBusIds);
    };
  }, [musicDisplay, mediaPlayer, isAutoscrollPreferred]);
};
