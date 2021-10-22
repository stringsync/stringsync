import { Skeleton } from 'antd';
import styled from 'styled-components';
import { Player } from '../Player';

const Outer = styled.div`
  display: flex;
  width: 100%;
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
};

export const Media: React.FC<Props> = (props) => {
  const fluid = props.fluid ?? true;

  return (
    <Outer data-testid="media">
      {props.loading && (
        <SkeletonOuter>
          <Skeleton.Image style={{ width: '100%', height: '100%' }} />
        </SkeletonOuter>
      )}

      {!props.loading && props.video && props.src && (
        <Player.Video playerOptions={{ fluid, sources: [{ src: props.src, type: 'application/x-mpegURL' }] }} />
      )}

      {!props.loading && !props.video && props.src && (
        <Player.Audio playerOptions={{ fluid, sources: [{ src: props.src, type: 'application/x-mpegURL' }] }} />
      )}
    </Outer>
  );
};