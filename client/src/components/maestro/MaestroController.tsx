import * as React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withRaf, IWithRafProps } from 'enhancers';
import { Time, RafSpec } from 'services';

interface IOuterProps {
  bpm: number;
  deadTimeMs: number;
  durationMs: number;
}

interface IConnectProps extends IOuterProps {
  isVideoActive: boolean;
  timeMs: number;
  videoPlayer: Youtube.IPlayer;
}

interface IRafHandlerProps extends IConnectProps {
  handleRafLoop: () => void;
}

type InnerProps = IRafHandlerProps & IWithRafProps;

const enhance = compose<InnerProps, IOuterProps>(
  connect(
    (state: Store.IState) => ({
      isVideoActive: state.video.isActive,
      timeMs: state.maestro.timeMs,
      videoPlayer: state.video.player,
    })
  ),
  lifecycle<IConnectProps, {}>({
    componentWillReceiveProps(nextProps) {
      const raf = window.ss.rafLoop;
      if (nextProps.isVideoActive) {
        // raf.start();
      } else {
        raf.stop();
      }

      const { maestro } = window.ss;

      // sync IOuterProps with maestro
      maestro.bpm = nextProps.bpm;

      if (maestro.deadTime.ms !== nextProps.deadTimeMs) {
        maestro.deadTime = new Time(nextProps.deadTimeMs, 'ms');
      }

      if (this.props.durationMs !== nextProps.durationMs) {
        maestro.loopEnd = new Time(nextProps.durationMs, 'ms');
      }

      maestro.time = new Time(nextProps.timeMs, 'ms');
    },
    componentWillUnmount() {
      window.ss.rafLoop.stop();
    }
  }),
  withHandlers({
    /** q
     * Update the timeKeeper.currentTimeMs and call maestro.update whenever the rafLoop is active.
     */
    handleRafLoop: (props: IConnectProps) => () => {
      if (!window.ss.maestro) {
        throw new Error('expected an instance of Maestro to be defined on window.ss');
      } else if (!props.videoPlayer) {
        throw new Error('expected a Youtube video player to be defined in the store');
      }

      window.ss.maestro.time = new Time(props.videoPlayer.getCurrentTime(), 's');
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
