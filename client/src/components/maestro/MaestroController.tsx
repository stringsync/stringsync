import * as React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withRaf, IWithRafProps } from 'enhancers';
import { Maestro, Time, RafLoop, RafSpec } from 'services';

class MaestroError extends Error { };

interface IOuterProps {
  bpm: number;
  deadTimeMs: number;
}

interface IConnectProps extends IOuterProps {
  isVideoActive: boolean;
  videoPlayer: Youtube.IPlayer;
}

interface IRafHandlerProps extends IConnectProps {
  handleRafLoop: () => void;
}

type InnerProps = IRafHandlerProps & IWithRafProps;

const enhance = compose<InnerProps, IOuterProps>(
  connect(
    (state: StringSync.Store.IState) => ({
      isVideoActive: state.video.isActive,
      videoPlayer: state.video.player
    })
  ),
  lifecycle<IConnectProps, {}>({
    componentWillMount() {
      window.ss.maestro = new Maestro(this.props.deadTimeMs, this.props.bpm);
      window.ss.rafLoop = new RafLoop();
    },
    componentWillReceiveProps(nextProps) {
      if (!window.ss.rafLoop) {
        throw new MaestroError('Expected an instance of RafLoop to be defined on window.ss');
      }

      if (nextProps.isVideoActive) {
        window.ss.rafLoop.start();
      } else {
        window.ss.rafLoop.stop();
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
    handleRafLoop: (props: IConnectProps) => () => {
      if (!window.ss.maestro) {
        throw new MaestroError('expected an instance of Maestro to be defined on window.ss');
      } else if (!props.videoPlayer) {
        throw new MaestroError('expected a Youtube video player to be defined in the store');
      }

      window.ss.maestro.time = new Time(props.videoPlayer.getCurrentTime(), 's');

      window.ss.maestro.update();
    }
  }),
  withRaf(
    () => window.ss.rafLoop!,
    (props: InnerProps) => new RafSpec('MaestroController.handleRafLoop', 0, props.handleRafLoop)
  )
);

/**
 * This component has three main responsibilities:
 * 
 * 1. Sync maestro.time with videoPlayer.getCurrentTime()
 * 2. Add the maestro.update() callback in the rafLoop
 * 3. Start-and-stop the rafLoop when its props warrant it
 */
export const MaestroController = enhance(() => null);
