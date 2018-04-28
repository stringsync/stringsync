import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import styled from 'react-emotion';

const enhance = compose(
  connect(
    state => ({
      videoPlayer: state.video.player,
      isVideoActive: state.video.isActive
    })
  ),
  withHandlers({
    handlePlayClick: props => event => {
      props.videoPlayer.playVideo();
    },
    handlePauseClick: props => event => {
      props.videoPlayer.pauseVideo();
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

const PlayToggle = enhance(props => (
  <Outer onClick={props.isVideoActive ? props.handlePauseClick : props.handlePlayClick}>
    <StyledIcon type={`${props.isVideoActive ? 'pause' : 'play'}-circle-o`} />
  </Outer>
));

export default PlayToggle;
