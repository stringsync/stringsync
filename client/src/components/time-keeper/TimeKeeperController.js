import React from 'react';
import { compose, setPropTypes, lifecycle } from 'recompose';
import { Maestro } from 'services';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const enhance = compose(
  setPropTypes({
    bpm: PropTypes.number,
    deadTimeMs: PropTypes.number
  }),
  connect(
    state => ({
      videoPlayer: state.video.player,
      isVideoActive: state.video.isActive
    })
  ),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (nextProps.isVideoActive) {
        window.ss.rafLoop.start();
      } else {
        window.ss.rafLoop.stop();
      }
    },
    componentWillUnmount() {
      window.ss.stop();
    }
  })
);

const TimeKeeperController = enhance(() => null);

export default TimeKeeperController;
