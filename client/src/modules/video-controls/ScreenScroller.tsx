import * as React from 'react';
import { compose } from 'recompose';
import { Icon } from 'antd';
import styled from 'react-emotion';

interface IInnerProps {
  isVideoActive: boolean;
  videoPlayer: Youtube.IPlayer;
  handlePlayClick: (event: React.SyntheticEvent<HTMLElement>) => void;
  handlePauseClick: (event: React.SyntheticEvent<HTMLElement>) => void;
}

const enhance = compose<IInnerProps, {}>(
);

const Outer = styled('span')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
`;

const StyledIcon = styled(Icon)`
  &:active {
    font-size: 20px;
  }

  transition: font-size 40ms ease-in;
`;

export const ScreenScroller = enhance(props => (
  <Outer>
    <StyledIcon type="scan" />
  </Outer>
));
