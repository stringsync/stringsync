import { Skeleton } from 'antd';
import styled from 'styled-components';
import { MediaPlayer } from '../lib/MediaPlayer';
import { Player } from './Player';

const Outer = styled.div<{ $video: boolean }>`
  display: flex;
  width: 100%;
  display: ${(props) => (props.$video ? 'inherit' : 'none')};
  position: relative;
  background-color: black;
  opacity: 1;
`;

const SkeletonOuter = styled.div`
  aspect-ratio: 16/9;
  width: 100%;
  z-index: 2;
  background: black;
  opacity: 1;

  .ant-skeleton {
    width: 100%;
    height: 100%;
  }

  .ant-skeleton-element .ant-skeleton-image {
    background: black;
  }
`;

type Props = {
  skeleton?: boolean;
  video: boolean;
  fluid?: boolean;
  src: string | null;
  onPlayerChange?: (mediaPlayer: MediaPlayer) => void;
};

export const Media: React.FC<Props> = (props) => {
  const fluid = props.fluid ?? true;

  return (
    <Outer data-testid="media" $video={props.video}>
      {props.video && props.src ? (
        <Player.Video
          playerOptions={{ fluid, sources: [{ src: props.src, type: 'application/x-mpegURL' }] }}
          onPlayerChange={props.onPlayerChange}
        />
      ) : (
        <SkeletonOuter>
          <Skeleton.Image style={{ width: '100%', height: '100%' }} />
        </SkeletonOuter>
      )}

      {!props.video && props.src && (
        <Player.Audio
          playerOptions={{ fluid, sources: [{ src: props.src, type: 'application/x-mpegURL' }] }}
          onPlayerChange={props.onPlayerChange}
        />
      )}
    </Outer>
  );
};
