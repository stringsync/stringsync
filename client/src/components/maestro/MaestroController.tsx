import * as React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withRaf } from 'enhancers';
import { Maestro, TimeKeeper, RafLoop, RafSpec } from 'services';

class MaestroError extends Error { };

interface IOuterProps {
  bpm: number;
  deadTimeMs: number;
}

interface IInnerProps extends IOuterProps {
  isVideoActive: boolean;
  videoPlayer: Youtube.IPlayer;
}

const enhance = compose<IInnerProps, IOuterProps>(
  connect(
    (state: StringSync.Store.IState) => ({
      isVideoActive: state.video.isActive,
      videoPlayer: state.video.player
    })
  ),
  lifecycle<any, {}>({
    componentWillMount() {
      const timeKeeper = new TimeKeeper(this.props.bpm, this.props.deadTimeMs);
      window.ss.maestro = new Maestro(timeKeeper);
      window.ss.rafLoop = new RafLoop();
    },
    componentWillReceiveProps(nextProps) {
      if (!window.ss.rafLoop) {
        throw new MaestroError('Expected an instance of RafLoop to be defined on window.ss');
      }

      if (nextProps.isVideoActive) {
        window.ss.rafLoop.start();
      } else {
        window.ss.rafLoop!.stop();
      }
    },
    componentWillUnmount() {
      if (!window.ss.rafLoop) {
        throw new MaestroError('Expected an instance of RafLoop to be defined on window.ss');
      }

      window.ss.rafLoop.stop();
      window.ss.maestro = undefined;
      window.ss.rafLoop = undefined;
    }
  }),
  withHandlers({
    /**
     * Update the timeKeeper.currentTimeMs and call maestro.update whenever the rafLoop is active.
     */
    handleRafLoop: (props: any) => () => {
      if (!window.ss.maestro) {
        throw new MaestroError('Expected an instance of Maestro to be defined on window.ss');
      }

      if (props.videoPlayer) {
        window.ss.maestro.timeKeeper.currentTimeMs = props.videoPlayer.getCurrentTime() * 1000;
      }

      window.ss.maestro.update();
    }
  }),
  withRaf(
    () => window.ss.rafLoop!,
    (props: any) => new RafSpec('MaestroController.handleRafLoop', 0, props.handleRafLoop)
  )
);

/**
 * This component has three main responsibilities:
 * 
 * 1. Sync maestro.timeKeeper.currentTimeMs with videoPlayer.getCurrentTime() in the redux store
 * 2. Add the maestro.update() callback in the rafLoop
 * 3. Start-and-stop the rafLoop when its props warrant it
 */
export const MaestroController = enhance(() => null);
