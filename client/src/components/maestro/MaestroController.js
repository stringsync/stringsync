import React from 'react';
import { compose, setPropTypes, lifecycle, withHandlers } from 'recompose';
import { Maestro, TimeKeeper, RafSpec } from 'services';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRaf } from 'enhancers';

const enhance = compose(
  setPropTypes({
    bpm: PropTypes.number,
    deadTimeMs: PropTypes.number
  }),
  connect(
    state => ({
      videoPlayer: state.video.player,
      isVideoActive: state.video.isActive,
    })
  ),
  withHandlers({
    /**
     * Update the timeKeeper.currentTimeMs and call maestro.update whenever the rafLoop is active.
     */
    handleRafLoop: props => () => {
      const { maestro } = window.ss;

      if (props.videoPlayer) {
        maestro.timeKeeper.currentTimeMs = props.videoPlayer.getCurrentTime() * 1000;
      }

      maestro.update();
    }
  }),
  withRaf(
    () => window.ss.rafLoop,
    props => new RafSpec('MaestroController.handleRafLoop', 0, props.handleRafLoop)
  ),
  lifecycle({
    componentDidMount() {
      const timeKeeper = new TimeKeeper(this.props.bpm, this.props.deadTimeMs);
      window.ss.maestro = new Maestro(timeKeeper);
    },
    componentWillReceiveProps(nextProps) {
      if (nextProps.isVideoActive) {
        window.ss.rafLoop.start();
      } else {
        window.ss.rafLoop.stop();
      }
    },
    componentWillUnmount() {
      window.ss.stop();
      window.ss.maestro = undefined;
    }
  })
);

/**
 * This component has three main responsibilities:
 * 
 * 1. Sync maestro.timeKeeper.currentTimeMs with videoPlayer.getCurrentTime() in the redux store
 * 2. Add the maestro.update() callback in the rafLoop
 * 3. Start-and-stop the rafLoop when its props warrant it
 */
const MaestroController = enhance(() => null);

export default TimeKeeperController;
