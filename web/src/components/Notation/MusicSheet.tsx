import { Skeleton } from 'antd';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { RenderableNotation } from '.';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { Nullable } from '../../util/types';
import { useMusicDisplay } from './hooks/useMusicDisplay';
import { useCSSCursor } from './hooks/useMusicDisplayCSSCursor';

const Outer = styled.div<{ $cursor: string }>`
  cursor: ${(props) => props.$cursor};
  padding-top: 24px;
  height: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: white;
`;

const SkeletonContainer = styled.div`
  padding: 64px;
  max-height: 0;
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
  loading: boolean;
  notation: Nullable<RenderableNotation>;
  onMusicDisplayChange?: (musicDisplay: MusicDisplay) => void;
};

export const MusicSheet: React.FC<Props> = (props) => {
  // props
  const loading = props.loading;
  const notation = props.notation;
  const onMusicDisplayChange = props.onMusicDisplayChange;

  // music display
  const musicDisplayDivRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [musicDisplay, musicDisplayLoading] = useMusicDisplay(
    notation,
    musicDisplayDivRef.current,
    scrollContainerRef.current
  );
  useEffect(() => {
    onMusicDisplayChange?.(musicDisplay);
    (window as any).md = musicDisplay;
  }, [musicDisplay, onMusicDisplayChange]);

  // css effects
  const cursor = useCSSCursor(musicDisplay);

  return (
    <>
      {!loading && musicDisplayLoading && (
        <LoadingOverlay>
          <Loading>loading</Loading>
        </LoadingOverlay>
      )}
      <Outer data-testid="music-sheet" $cursor={cursor} ref={scrollContainerRef}>
        {loading && (
          <SkeletonContainer>
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
          </SkeletonContainer>
        )}

        {!loading && (
          <MusicSheetContainer data-notation>
            <MusicDisplayDiv draggable={false} ref={musicDisplayDivRef} />
          </MusicSheetContainer>
        )}
      </Outer>
    </>
  );
};
