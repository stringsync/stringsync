import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MusicDisplay } from '../../lib/MusicDisplay';

// It's generous to prevent autoscrolling from deactivating
// itself.
const AUTO_SCROLL_TIMEOUT_MS = 500;

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
  onMusicDisplayChange?: (musicDisplay: MusicDisplay | null) => void;
};

export const Notation: React.FC<NotationProps> = (props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const autoScrollingTimeoutRef = useRef(0);

  const [isLoading, setIsLoading] = useState(false);
  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const { musicXmlUrl, deadTimeMs, durationMs, onMusicDisplayChange } = props;

  useEffect(() => {
    if (onMusicDisplayChange) {
      onMusicDisplayChange(musicDisplay);
    }
  }, [musicDisplay, onMusicDisplayChange]);

  useEffect(() => {
    if (!isAutoScrolling) {
      return;
    }
    clearTimeout(autoScrollingTimeoutRef.current);
    autoScrollingTimeoutRef.current = window.setTimeout(() => {
      setIsAutoScrolling(false);
    }, AUTO_SCROLL_TIMEOUT_MS);
  }, [isAutoScrolling]);

  useEffect(() => {
    const div = divRef.current;
    if (!div) {
      return;
    }

    const startLoading = () => setIsLoading(true);
    const stopLoading = () => setIsLoading(false);

    const musicDisplay = new MusicDisplay(div, {
      syncSettings: { deadTimeMs, durationMs },
      onLoadStart: startLoading,
      onLoadEnd: stopLoading,
      onResizeStart: startLoading,
      onResizeEnd: stopLoading,
      onAutoScrollStart: () => setIsAutoScrolling(true),
      onAutoScrollEnd: () => setIsAutoScrolling(false),
    });
    setMusicDisplay(musicDisplay);

    musicDisplay.load(musicXmlUrl);

    return () => {
      musicDisplay.clear();
      setMusicDisplay(null);
    };
  }, [musicXmlUrl, deadTimeMs, durationMs]);

  return (
    <Outer>
      {isLoading && (
        <LoadingOverlay>
          <Loading>loading</Loading>
        </LoadingOverlay>
      )}
      <div ref={divRef} />
    </Outer>
  );
};
