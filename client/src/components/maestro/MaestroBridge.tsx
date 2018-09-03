import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { Time } from 'services';

interface IOuterProps {
  bpm: number;
  deadTimeMs: number;
  durationMs: number;
}

const enhance = compose<IOuterProps, IOuterProps>(
  lifecycle<IOuterProps, {}>({
    componentDidUpdate(prevProps) {
      const { maestro } = window.ss;

      // sync IOuterProps with maestro
      if (maestro.bpm !== this.props.bpm) {
        maestro.bpm = this.props.bpm;
      }

      if (maestro.deadTime.ms !== this.props.deadTimeMs) {
        maestro.deadTime = new Time(this.props.deadTimeMs, 'ms');
      }

      if (this.props.durationMs !== prevProps.durationMs) {
        maestro.loopEnd = new Time(this.props.durationMs, 'ms');
      }
    }
  })
);

/**
 * This component has three main responsibilities:
 * 
 * 1. Sync maestro.time with videoPlayer.getCurrentTime()
 * 2. Add the maestro.update() callback in the rafLoop
 * 3. Start-and-stop the rafLoop when its props warrant it
 */
export const MaestroBridge = enhance(() => null);
