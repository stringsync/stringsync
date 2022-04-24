import { Skeleton } from 'antd';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { RenderableNotation } from '.';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { DisplayMode } from '../../lib/musicxml';
import { Nullable } from '../../util/types';
import { useMusicDisplay } from './hooks/useMusicDisplay';
import { useCSSCursor } from './hooks/useMusicDisplayCSSCursor';
import { useMusicXml } from './hooks/useMusicXML';

const Outer = styled.div<{ $cursor: string }>`
  cursor: ${(props) => props.$cursor};
  padding-top: 24px;
  height: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: white;
`;

const SkeletonOuter = styled.div`
  padding: 64px;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 2;
`;

const MusicSheetContainer = styled.div`
  height: 100%;
`;

const MusicDisplayDiv = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: white;
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
  pointer-events: none;
  padding-top: 24px;
`;

const Loading = styled.small`
  margin-top: 36px;
`;

type Props = {
  skeleton: boolean;
  notation: Nullable<RenderableNotation>;
  displayMode: DisplayMode;
  onMusicDisplayChange?: (musicDisplay: MusicDisplay) => void;
};

export const MusicSheet: React.FC<Props> = (props) => {
  // props
  const loading = props.skeleton;
  const notation = props.notation;
  const onMusicDisplayChange = props.onMusicDisplayChange;

  // music display
  const musicDisplayContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const musicXml = useMusicXml(notation, props.displayMode);
  const [musicDisplay, musicDisplayLoading] = useMusicDisplay({
    musicXml,
    deadTimeMs: notation?.deadTimeMs || 0,
    durationMs: notation?.durationMs || 0,
    musicDisplayContainer: musicDisplayContainerRef.current,
    scrollContainer: scrollContainerRef.current,
  });
  useEffect(() => {
    onMusicDisplayChange?.(musicDisplay);
  }, [musicDisplay, onMusicDisplayChange]);

  // css effects
  const cursor = useCSSCursor(musicDisplay);

  return (
    <>
      {props.skeleton && (
        <SkeletonOuter>
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
          <br />
          <br />
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
          <br />
          <br />
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
          <br />
          <br />
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
          <br />
          <br />
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
          <br />
          <br />
          <Skeleton loading title={false} paragraph={{ rows: 3 }} />
        </SkeletonOuter>
      )}

      {!loading && musicDisplayLoading && (
        <LoadingOverlay>
          <Loading>loading</Loading>
        </LoadingOverlay>
      )}

      <Outer data-testid="music-sheet" $cursor={cursor} ref={scrollContainerRef}>
        <MusicSheetContainer data-notation>
          <MusicDisplayDiv draggable={false} ref={musicDisplayContainerRef} />
        </MusicSheetContainer>
      </Outer>
    </>
  );
};
