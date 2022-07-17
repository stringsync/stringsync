import { Alert, Row } from 'antd';
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
  user-select: none;
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

const Loading = styled(Row)`
  position: absolute;
  top: 24px;
  z-index: 2;
  width: 100%;
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
  const outerRef = useRef<HTMLDivElement>(null);
  const musicXml = useMusicXml(notation?.musicXmlUrl || null);
  const [musicDisplay, loading] = useMusicDisplay({
    musicXml,
    deadTimeMs: notation?.deadTimeMs || 0,
    durationMs: notation?.durationMs || 0,
    musicDisplayContainer: musicDisplayContainerRef.current,
    scrollContainer: outerRef.current,
    displayMode: props.displayMode,
  });
  useEffect(() => {
    onMusicDisplayChange?.(musicDisplay);
  }, [musicDisplay, onMusicDisplayChange]);

  // ids
  const idPrefix = useId();
  const musicSheetContainerId = `${idPrefix}-music-sheet`;

  // width resize
  const [widthPx, setWidthPx] = useState(0);
  const prevWidthPx = usePrevious(widthPx);
  const onMusicSheetContainerResize = useCallback((entries: ResizeObserverEntry[]) => {
    if (entries.length) {
      const rect = entries[0].contentRect;
      setWidthPx(rect.width);
    }
  }, []);
  useResizeObserver(musicSheetContainerId, onMusicSheetContainerResize);
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

  // css effects
  const cursor = useCSSCursor(musicDisplay);

  return (
    <Outer data-testid="music-sheet" $cursor={cursor} ref={outerRef}>
      {loading && (
        <Loading justify="center">
          <Alert type="warning" message={<small>loading</small>} style={{ padding: '2px 12px' }} />
        </Loading>
      )}

      <MusicSheetContainer data-notation id={musicSheetContainerId} style={{ opacity: loading ? 0.1 : undefined }}>
        <MusicDisplayDiv draggable={false} ref={musicDisplayContainerRef} />
      </MusicSheetContainer>
    </Outer>
  );
};
