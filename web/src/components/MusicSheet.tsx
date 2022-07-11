import { useCallback, useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { useMusicDisplay } from '../hooks/useMusicDisplay';
import { useCSSCursor } from '../hooks/useMusicDisplayCSSCursor';
import { useMusicXml } from '../hooks/useMusicXML';
import { usePrevious } from '../hooks/usePrevious';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { LoadingStatus, MusicDisplay } from '../lib/MusicDisplay';
import { DisplayMode } from '../lib/musicxml';
import * as notations from '../lib/notations';
import { Nullable } from '../util/types';

const Outer = styled.div<{ $cursor: string }>`
  cursor: ${(props) => props.$cursor};
  padding-top: 24px;
  height: 100%;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: white;
`;

const MusicSheetContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const MusicDisplayDiv = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: white;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.9;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 2;
  text-align: center;
  pointer-events: none;
  padding-top: 24px;
`;

const Loading = styled.small`
  margin-top: 36px;
`;

type Props = {
  skeleton?: boolean;
  notation: Nullable<notations.RenderableNotation>;
  displayMode: DisplayMode;
  onMusicDisplayChange?: (musicDisplay: MusicDisplay) => void;
};

export const MusicSheet: React.FC<Props> = (props) => {
  // props
  const notation = props.notation;
  const onMusicDisplayChange = props.onMusicDisplayChange;

  // music display
  const musicDisplayContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const musicXml = useMusicXml(notation?.musicXmlUrl || null);
  const [musicDisplay, loading] = useMusicDisplay({
    musicXml,
    deadTimeMs: notation?.deadTimeMs || 0,
    durationMs: notation?.durationMs || 0,
    musicDisplayContainer: musicDisplayContainerRef.current,
    scrollContainer: scrollContainerRef.current,
    displayMode: props.displayMode,
  });
  useEffect(() => {
    onMusicDisplayChange?.(musicDisplay);
  }, [musicDisplay, onMusicDisplayChange]);

  // resize
  const musicSheetContainerId = useId();
  const [widthPx, setWidthPx] = useState(0);
  const prevWidthPx = usePrevious(widthPx);
  const onResize = useCallback((entries: ResizeObserverEntry[]) => {
    if (entries.length) {
      const nextWidthPx = entries[0].contentRect.width;
      setWidthPx(nextWidthPx);
    }
  }, []);
  useEffect(() => {
    if (musicDisplay.getLoadingStatus() !== LoadingStatus.Done) {
      return;
    }
    if (widthPx === 0) {
      return;
    }
    if (widthPx === prevWidthPx) {
      return;
    }
    musicDisplay.resize();
  }, [musicDisplay, widthPx, prevWidthPx]);
  useResizeObserver(musicSheetContainerId, onResize);

  // css effects
  const cursor = useCSSCursor(musicDisplay);

  return (
    <>
      <Outer data-testid="music-sheet" $cursor={cursor} ref={scrollContainerRef}>
        {loading && (
          <LoadingOverlay>
            <Loading>loading</Loading>
          </LoadingOverlay>
        )}

        <MusicSheetContainer data-notation id={musicSheetContainerId}>
          <MusicDisplayDiv draggable={false} ref={musicDisplayContainerRef} />
        </MusicSheetContainer>
      </Outer>
    </>
  );
};
