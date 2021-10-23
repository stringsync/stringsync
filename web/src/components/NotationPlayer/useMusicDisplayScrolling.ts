import { useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay } from '../../lib/MusicDisplay';
import { isTemporal } from '../../lib/MusicDisplay/pointer';
import { ScrollControls } from './useMusicDisplayScrollControls';
import { VideoPlayerState } from './useVideoPlayerState';

export const useMusicDisplayScrolling = (
  musicDisplay: OpenSheetMusicDisplay | null,
  scrollControls: ScrollControls,
  videoPlayerState: VideoPlayerState
) => {
  const isMusicDisplayResizingRef = useRef(false);
  const isMusicDisplayLoadingRef = useRef(false);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    if (videoPlayerState !== VideoPlayerState.Playing) {
      return;
    }
    scrollControls.startPreferredScrolling();
  }, [musicDisplay, videoPlayerState, scrollControls]);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('selectionstarted', () => {
        musicDisplay.getScroller().startManualScrolling();
      }),
      musicDisplay.eventBus.subscribe('selectionupdated', (payload) => {
        musicDisplay.getScroller().updateScrollIntent(payload.dst.position.relY);
      }),
      musicDisplay.eventBus.subscribe('selectionended', () => {
        scrollControls.startPreferredScrolling();
      }),
      musicDisplay.eventBus.subscribe('cursordragstarted', () => {
        musicDisplay.getScroller().startManualScrolling();
      }),
      musicDisplay.eventBus.subscribe('cursordragupdated', (payload) => {
        musicDisplay.getScroller().updateScrollIntent(payload.dst.position.relY);
      }),
      musicDisplay.eventBus.subscribe('cursordragended', (payload) => {
        scrollControls.startPreferredScrolling();
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
        if (videoPlayerState !== VideoPlayerState.Playing) {
          return;
        }
        if (!isTemporal(payload.src)) {
          return;
        }
        scrollControls.startPreferredScrolling();
      }),
    ];

    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay, scrollControls, videoPlayerState]);

  return scrollControls;
};
