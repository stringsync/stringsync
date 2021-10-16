import { Skeleton } from 'antd';
import React from 'react';
import styled from 'styled-components';

const SkeletonOuter = styled.div`
  .ant-skeleton {
    width: 100%;
    height: 100%;
  }
`;

const AspectRatio16to9 = styled.div`
  aspect-ratio: 16/9;
`;

const Padded = styled.div`
  padding: 24px;
`;

type Props = {
  loading: boolean;
  videoSkeleton?: boolean;
};

export const Sidecar: React.FC<Props> = (props) => {
  const videoSkeleton = props.videoSkeleton || false;

  return (
    <div data-testid="sidecar">
      {props.loading && (
        <SkeletonOuter>
          {videoSkeleton && (
            <AspectRatio16to9>
              <Skeleton.Image style={{ width: '100%', height: '100%' }} />
            </AspectRatio16to9>
          )}
          <Padded>
            <Skeleton loading paragraph={{ rows: 1 }} />
            <Skeleton avatar loading paragraph={{ rows: 2 }} />
            <Skeleton avatar loading paragraph={{ rows: 2 }} />
            <Skeleton avatar loading paragraph={{ rows: 2 }} />
            <Skeleton avatar loading paragraph={{ rows: 2 }} />
          </Padded>
        </SkeletonOuter>
      )}

      {!props.loading && props.children}
    </div>
  );
};
