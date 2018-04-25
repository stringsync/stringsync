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
      isVideoActive: state.video.isActive,
      durationMs: state.notations.show.attributes.durationMs
    })
  ),
  withState('value', 'setValue', 0),
  withHandlers({
    handleChange: props => value => {
      props.setValue(value);
    },
    handleAfterChange: props => value => {
      props.setValue(value);
    }
  }),
  withHandlers({
    handleRafLoop: props => () => {
      const value = 100 * window.ss.maestro.timeKeeper.currentTimeMs / props.durationMs;

      // Guard against NaN
      if (value === value) {
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
    step={0.01}
    style={{ margin: '0 4px 0 4px' }}
  />
));

export default Scrubber;
