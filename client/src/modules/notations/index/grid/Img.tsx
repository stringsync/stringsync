import * as React from 'react';
import styled from 'react-emotion';
import placeholderSrc from '../../../../assets/thumbnail_placeholder.jpg';
import { Icon } from 'antd';

interface IProps {
  src: string;
  alt: string;
  loading: boolean;
  onLoad: () => void;
}

const Outer = styled('div')`
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
  <Outer>
    <StyledImg
      src={placeholderSrc}
      zIndex={2}
      hidden={!props.loading}
    />
    <StyledImg
      src={props.src}
      alt={props.alt}
      zIndex={1}
      hidden={props.loading}
      onLoad={props.onLoad}
    />
  </Outer>
));
