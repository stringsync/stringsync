import { Skeleton } from 'antd';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { RenderableNotation } from '.';
import { useNoTouchAction } from '../../hooks/useNoTouchAction';
import { useNoTouchCallout } from '../../hooks/useNoTouchCallout';
import { useNoUserSelect } from '../../hooks/useNoUserSelect';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { Nullable } from '../../util/types';
import { useMusicDisplay } from './hooks/useMusicDisplay';
import { useCSSCursor } from './hooks/useMusicDisplayCSSCursor';

const DUMMY_DIV = document.createElement('div');

const Outer = styled.div<{ $cursor: string }>`
  cursor: ${(props) => props.$cursor};
  padding-top: 24px;
  height: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
`;

const MusicSheetContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MusicDisplayDiv = styled.div<{ $loading: boolean }>`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: white;
  opacity: 0.9;
`;

const SkeletonContainer = styled.div`
  padding: 64px;
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
  const musicDisplayContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [musicDisplay, musicDisplayLoading] = useMusicDisplay(
    notation,
    musicDisplayContainerRef.current,
    scrollContainerRef.current
  );
  useEffect(() => {
    onMusicDisplayChange?.(musicDisplay);
  }, [musicDisplay, onMusicDisplayChange]);

  // css effects
  const cursor = useCSSCursor(musicDisplay);
  useNoUserSelect(musicDisplayContainerRef.current || DUMMY_DIV);
  useNoTouchAction(document.body);
  useNoTouchCallout(document.body);

  return (
    <>
      {!loading && musicDisplayLoading && (
        <LoadingOverlay>
          <Loading>loading</Loading>
        </LoadingOverlay>
      )}
      <Outer data-testid="music-display" $cursor={cursor} ref={scrollContainerRef}>
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
            <MusicDisplayDiv draggable={false} ref={musicDisplayContainerRef} $loading />
          </MusicSheetContainer>
        )}
      </Outer>
    </>
  );
};
