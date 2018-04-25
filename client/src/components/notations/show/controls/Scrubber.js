import React from 'react';
import { compose, withHandlers } from 'recompose';
import { Slider } from 'antd';
import { connect } from 'react-redux';

const enhance = compose(
  connect(
    state => ({
      videoPlayer: state.video.player,
      isVideoActive: state.video.isActive
    })
  ),
  withHandlers({
    handleChange: props => value => {
    },
    handleAfterChange: props => value => {
    }
  })
);

const Scrubber = enhance(props => (
  <Slider
    onChange={props.handleChange}
    onAfterChange={props.handleAfterChange}
    step={0.01}
    style={{ margin: '0 4px 0 4px' }}
  />
));

export default Scrubber;
