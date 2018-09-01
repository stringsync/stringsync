import * as React from 'react';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import { observeMaestro } from 'enhancers';
import { Line, VextabElement } from 'models';
import { Maestro } from 'services';
import { scroller } from 'react-scroll';
import { scoreKey } from './scoreKey';
import { get } from 'lodash';
import { connect } from 'react-redux';

interface IConnectProps {
  isVideoActive: boolean;
}

interface IFocusedLineProps extends IConnectProps {
  focusedLine: Line;
  setFocusedLine: (line: Line | null) => void;
}

interface IInnerProps extends IFocusedLineProps {
  handleNotification: (maestro: Maestro) => void;
}

const enhance = compose<IInnerProps, {}>(
  connect(
    (state: Store.IState) => ({
      isVideoActive: state.video.isActive
    })
  ),
  withState('focusedLine', 'setFocusedLine', null),
  lifecycle<IFocusedLineProps, {}>({
    componentDidUpdate(prevProps): void {
      if (this.props.isVideoActive !== prevProps.isVideoActive) {
        this.props.setFocusedLine(null);
      }
    }
  }),
  withHandlers({
    handleNotification: (props: IFocusedLineProps) => (maestro: Maestro) => {
      const { state, prevState } = maestro;

      let targetNote: VextabElement | null;
      try {
        if (prevState.loopStart.ms !== state.loopStart.ms && maestro.tickMap) {
          // loopStart is scrubbing
          targetNote = maestro.tickMap.fetch(state.loopStart.tick).note;
        } else if (prevState.loopEnd.ms !== state.loopEnd.ms && maestro.tickMap) {
          // loopEnd is scrubbing
          targetNote = maestro.tickMap.fetch(state.loopEnd.tick).note;
        } else {
          // normal time change
          targetNote = state.note;
        }
      } catch (error) {
        targetNote = null;
      }

      const line = get(targetNote, 'measure.line') || null;
      
      if (props.focusedLine === line || !document.getElementById('score')) {
        return;
      }

      if (line) {
        scroller.scrollTo(scoreKey(maestro.vextab!, line), {
          containerId: 'score',
          duration: 200,
          ignoreCancelEvents: true,
          smooth: true,
        });
      }

      props.setFocusedLine(line);
    }
  }),
  observeMaestro<IInnerProps>(props => ({ name: 'ScoreScroller', handleNotification: props.handleNotification }))
);

export const Scroller = enhance(() => null);
