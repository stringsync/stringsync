import React, { RefObject, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MusicDisplay } from '../../lib/MusicDisplay';

const SELECTION_INDETERMINATE_ZONE = 100;

const Outer = styled.div<{ cursor: Cursor }>`
  margin-top: 24px;
  position: relative;
  cursor: ${(props) => props.cursor};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  opacity: 0.9;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 2;
  text-align: center;
`;

const Loading = styled.small`
  margin-top: 36px;
`;

type NotationProps = {
  musicXmlUrl: string;
  deadTimeMs: number;
  durationMs: number;
  scrollContainerRef: RefObject<HTMLDivElement>;
  onUserScroll?: () => void;
  onMusicDisplayChange?: (musicDisplay: MusicDisplay | null) => void;
};

enum Cursor {
  Default = 'default',
  EWResize = 'ew-resize',
  EResize = 'e-resize',
  WResize = 'w-resize',
  Grab = 'grab',
  Grabbing = 'grabbing',
}

export const Notation: React.FC<NotationProps> = (props) => {
  const { musicXmlUrl, deadTimeMs, durationMs, scrollContainerRef, onMusicDisplayChange, onUserScroll } = props;

  const divRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState(Cursor.Default);

  // A ref is used instead of state because we don't want to wait for
  // React to flush the values - the scroll handler will still be active
  // regardless of hooked state.
  const isAutoScrollingRef = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay | null>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }
    if (!onUserScroll) {
      return;
    }

    // If we're not auto scrolling, assume any scroll event was
    // triggered by the user.
    const listener = () => {
      if (!isAutoScrollingRef.current) {
        onUserScroll();
      }
    };
    scrollContainer.addEventListener('scroll', listener);

    return () => {
      scrollContainer.removeEventListener('scroll', listener);
    };
  }, [scrollContainerRef, onUserScroll]);

  useEffect(() => {
    if (onMusicDisplayChange) {
      onMusicDisplayChange(musicDisplay);
    }
  }, [musicDisplay, onMusicDisplayChange]);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }

    const handles = [
      musicDisplay.eventBus.subscribe('autoscrollstarted', () => {
        isAutoScrollingRef.current = true;
      }),
      musicDisplay.eventBus.subscribe('autoscrollended', () => {
        isAutoScrollingRef.current = false;
      }),
      musicDisplay.eventBus.subscribe('selectionupdated', (payload) => {
        const { anchorTimeMs, seekerTimeMs } = payload.selection;
        if (Math.abs(anchorTimeMs - seekerTimeMs) <= SELECTION_INDETERMINATE_ZONE) {
          setCursor(Cursor.EWResize);
        } else if (anchorTimeMs > seekerTimeMs) {
          setCursor(Cursor.EResize);
        } else {
          setCursor(Cursor.WResize);
        }
      }),
      musicDisplay.eventBus.subscribe('selectionended', () => {
        setCursor(Cursor.Default);
      }),
      musicDisplay.eventBus.subscribe('cursorentered', (payload) => {
        setCursor(Cursor.Grab);
      }),
      musicDisplay.eventBus.subscribe('cursorexited', () => {
        setCursor(Cursor.Default);
      }),
      musicDisplay.eventBus.subscribe('cursordragstarted', () => {
        setCursor(Cursor.Grabbing);
      }),
      musicDisplay.eventBus.subscribe('cursordragended', (payload) => {
        setCursor(payload.hoveredCursor ? Cursor.Grab : Cursor.Default);
      }),
    ];

    return () => {
      handles.forEach(musicDisplay.eventBus.unsubscribe.bind(musicDisplay.eventBus));
      setCursor(Cursor.Default);
    };
  }, [musicDisplay]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }

    const div = divRef.current;
    if (!div) {
      return;
    }

    const musicDisplay = new MusicDisplay(div, {
      syncSettings: { deadTimeMs, durationMs },
      scrollContainer,
    });

    const startLoading = () => setIsLoading(true);
    const stopLoading = () => setIsLoading(false);

    const loadStartedId = musicDisplay.eventBus.subscribe('loadstarted', startLoading);
    const loadEndedId = musicDisplay.eventBus.subscribe('loadended', stopLoading);
    const resizeStartedId = musicDisplay.eventBus.subscribe('resizestarted', startLoading);
    const resizeEndedId = musicDisplay.eventBus.subscribe('resizeended', stopLoading);

    setMusicDisplay(musicDisplay);
    musicDisplay.load(musicXmlUrl);

    return () => {
      musicDisplay.eventBus.unsubscribe(resizeEndedId);
      musicDisplay.eventBus.unsubscribe(resizeStartedId);
      musicDisplay.eventBus.unsubscribe(loadEndedId);
      musicDisplay.eventBus.unsubscribe(loadStartedId);

      musicDisplay.dispose();

      setMusicDisplay(null);
    };
  }, [musicXmlUrl, deadTimeMs, durationMs, scrollContainerRef]);

  return (
    <Outer data-notation cursor={cursor}>
      {isLoading && (
        <LoadingOverlay>
          <Loading>loading</Loading>
        </LoadingOverlay>
      )}
      <div ref={divRef} style={{ userSelect: 'none' }} />
    </Outer>
  );
};
