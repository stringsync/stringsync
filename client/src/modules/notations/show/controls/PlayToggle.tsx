import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import styled from 'react-emotion';

interface IInnerProps {
  isVideoActive: boolean;
  videoPlayer: Youtube.IPlayer;
  handlePlayClick: (event: React.SyntheticEvent<HTMLElement>) => void;
  handlePauseClick: (event: React.SyntheticEvent<HTMLElement>) => void;
}

const enhance = compose<IInnerProps, {}>(
  connect(
    (state: Store.IState) => ({
      isVideoActive: state.video.isActive,
      videoPlayer: state.video.player
    })
  ),
  withHandlers({
    handlePauseClick: (props: any) => (event: React.SyntheticEvent<HTMLElement>) => {
      if (props.videoPlayer) {
        props.videoPlayer.pauseVideo();
      }
    },
    handlePlayClick: (props: any) => (event: React.SyntheticEvent<HTMLElement>) => {
      if (props.videoPlayer) {
        props.videoPlayer.playVideo();
      }
    }
  })
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

export const PlayToggle = enhance(props => (
  <Outer onClick={props.isVideoActive ? props.handlePauseClick : props.handlePlayClick}>
    <StyledIcon type={`${props.isVideoActive ? 'pause' : 'play'}-circle-o`} />
  </Outer>
));
