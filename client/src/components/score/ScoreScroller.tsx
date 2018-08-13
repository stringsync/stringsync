import * as React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { observeMaestro } from 'enhancers';
import { Line, Note, MeasureElement } from 'models/music';
import { Maestro } from 'services';
import { scroller } from 'react-scroll';
import { scoreKey } from './scoreKey';
import { get } from 'lodash';

(window as any).scroller = scroller;

interface IFocusedLineProps {
  focusedLine: Line;
  setFocusedLine: (line: Line | null) => void;
}

interface IInnerProps extends IFocusedLineProps {
  handleNotification: (maestro: Maestro) => void;
}

const enhance = compose<IInnerProps, {}>(
  withState('focusedLine', 'setFocusedLine', null),
  withHandlers({
    handleNotification: (props: IFocusedLineProps) => (maestro: Maestro) => {
      const { state, prevState } = maestro;

      let targetNote: MeasureElement | null;
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

export const ScoreScroller = enhance(() => null);
