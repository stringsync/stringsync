import * as React from 'react';
import styled from 'react-emotion';
import { Skeleton } from 'antd';

interface IProps {
  src: string;
  alt: string;
  loading: boolean;
  onLoad: () => void;
}

const SkeletonOuter = styled('div')<{ hidden: boolean }>`
  padding: 24px;
  display: ${props => props.hidden ? 'none' : 'block'};
`;

const StyledImg = styled('img')<{ hidden: boolean, zIndex: number }>`
  display: ${props => props.hidden ? 'none' : 'block'};
  z-index: ${props => props.zIndex};
  width: 100%;
  height: 100%;
`;

/**
 * This component will conditionally show the placeholder until
 * the image loads. This avoids showing abrupt animations when
 * the image is loading.
 */
export const Img: React.SFC<IProps> = (props => (
  <div>
    <SkeletonOuter hidden={!props.loading}>
      <Skeleton
        active={true}
        loading={props.loading}
        paragraph={{ rows: 6 }}
      >
        <div />
      </Skeleton>
    </SkeletonOuter>
    <StyledImg
      src={props.src}
      alt={props.alt}
      zIndex={1}
      hidden={props.loading}
      onLoad={props.onLoad}
    />
  </div>
));
