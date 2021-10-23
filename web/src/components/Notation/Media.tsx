import { Skeleton } from 'antd';
import styled from 'styled-components';
import { MediaPlayer } from '../../lib/MediaPlayer';
import { Player } from '../Player';

const Outer = styled.div<{ $video: boolean }>`
  display: flex;
  width: 100%;
  display: ${(props) => (props.$video ? 'inherit' : 'none')};
`;

const SkeletonOuter = styled.div`
  width: 100%;

  .ant-skeleton {
    width: 100%;
    height: 100%;
  }
`;

type Props = {
  loading: boolean;
  video: boolean;
  fluid?: boolean;
  src: string | null;
  onPlayerChange: (mediaPlayer: MediaPlayer) => void;
};

export const Media: React.FC<Props> = (props) => {
  const fluid = props.fluid ?? true;

  return (
    <Outer data-testid="media" $video={props.video}>
      {props.loading && (
        <SkeletonOuter>
          <Skeleton.Image style={{ width: '100%', height: '100%' }} />
        </SkeletonOuter>
      )}

      {!props.loading && props.video && props.src && (
        <Player.Video
          playerOptions={{ fluid, sources: [{ src: props.src, type: 'application/x-mpegURL' }] }}
          onPlayerChange={props.onPlayerChange}
        />
      )}

      {!props.loading && !props.video && props.src && (
        <Player.Audio
          playerOptions={{ fluid, sources: [{ src: props.src, type: 'application/x-mpegURL' }] }}
          onPlayerChange={props.onPlayerChange}
        />
      )}
    </Outer>
  );
};
