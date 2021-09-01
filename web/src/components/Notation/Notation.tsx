import React, { RefObject, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MusicDisplay } from '../../lib/MusicDisplay';

const Outer = styled.div`
  margin-top: 24px;
  position: relative;
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

export const Notation: React.FC<NotationProps> = (props) => {
  const { musicXmlUrl, deadTimeMs, durationMs, scrollContainerRef, onMusicDisplayChange, onUserScroll } = props;

  const divRef = useRef<HTMLDivElement>(null);

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
    const autoScrollStartedHandle = musicDisplay.eventBus.subscribe('autoscrollstarted', () => {
      isAutoScrollingRef.current = true;
    });
    const autoScrollEndedHandle = musicDisplay.eventBus.subscribe('autoscrollended', () => {
      isAutoScrollingRef.current = false;
    });

    return () => {
      musicDisplay.eventBus.unsubscribe(autoScrollEndedHandle);
      musicDisplay.eventBus.unsubscribe(autoScrollStartedHandle);
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
    <Outer data-notation>
      {isLoading && (
        <LoadingOverlay>
          <Loading>loading</Loading>
        </LoadingOverlay>
      )}
      <div ref={divRef} />
    </Outer>
  );
};
