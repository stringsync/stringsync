import * as React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { observeMaestro } from 'enhancers';
import { Line } from 'models/music';
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
      const line = get(maestro.state.note, 'measure.line') || null;
      
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
