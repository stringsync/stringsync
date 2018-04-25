import React from 'react';
import { compose, withHandlers, branch } from 'recompose';
import { connect } from 'react-redux';
import { Icon } from 'antd';

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

const PlayToggle = enhance(props => {
  if (props.isVideoActive) {
    return <Icon type="pause-circle-o" onClick={props.handlePauseClick} />
  } else {
    return <Icon type="play-circle-o" onClick={props.handlePlayClick} />
  }
});

export default PlayToggle;
