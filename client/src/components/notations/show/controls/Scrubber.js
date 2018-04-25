import React from 'react';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { Slider } from 'antd';
import { connect } from 'react-redux';
import { withRaf } from 'enhancers';
import { RafSpec } from 'services';

const enhance = compose(
  connect(
    state => ({
      videoPlayer: state.video.player,
      isVideoPlaying: state.video.playerState === 'PLAYING',
      durationMs: state.notations.show.attributes.durationMs
    })
  ),
  withState('value', 'setValue', 0),
  withState('playAfterChange', 'setPlayAfterChange', false),
  withState('isScrubbing', 'setIsScrubbing', false),
  withProps(props => ({
    valueToTimeMs: value => (value / 100) * props.durationMs
  })),
  withHandlers({
    handleChange: props => value => {
      if (!props.isScrubbing) {
        props.setIsScrubbing(true);
        props.setPlayAfterChange(props.isVideoPlaying);
      }

      props.videoPlayer.pauseVideo();

      const seekToTimeMs = props.valueToTimeMs(value);
      window.ss.maestro.timeKeeper.currentTimeMs = seekToTimeMs;
      props.videoPlayer.seekTo(seekToTimeMs / 1000, true);
      props.setValue(value);
    },
    handleAfterChange: props => value => {
      if (props.playAfterChange) {
        props.videoPlayer.playVideo();
      }

      const seekToTimeMs = props.valueToTimeMs(value);
      window.ss.maestro.timeKeeper.currentTimeMs = seekToTimeMs;
      props.setValue(value);

      props.setPlayAfterChange(false);
      props.setIsScrubbing(false);
    }
  }),
  withHandlers({
    handleRafLoop: props => () => {
      const value = 100 * window.ss.maestro.timeKeeper.currentTimeMs / props.durationMs;

      // Guard against NaN since it makes the page crash
      if (value === value && !props.isScrubbing) {
        props.setValue(value);
      }
    }
  }),
  withRaf(
    () => window.ss.rafLoop,
    props => new RafSpec('Scrubber.handleRafLoop', 1, props.handleRafLoop)
  )
);

const Scrubber = enhance(props => (
  <Slider
    onChange={props.handleChange}
    onAfterChange={props.handleAfterChange}
    value={props.value}
    tipFormatter={null}
    step={0.01}
    style={{ margin: '0 4px 0 4px' }}
  />
));

export default Scrubber;
