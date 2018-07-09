import * as React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { observeMaestro } from 'enhancers';
import { Line } from 'models/music';
import { Maestro } from 'services';
import { scroller } from 'react-scroll';

interface IFocusedLineProps {
  focusedLine: Line;
  setFocusedLine: (line: Line) => void;
}

interface IInnerProps extends IFocusedLineProps {
  handleNotification: (maestro: Maestro) => void;
}

const enhance = compose<IInnerProps, {}>(
  withState('focusedLine', 'setFocusedLine', null),
  withHandlers({
    handleNotification: (props: IFocusedLineProps) => (maestro: Maestro) => {
      const { line } = maestro.state;
      
      if (props.focusedLine !== line) {
        return;
      } else if (!maestro.vextab) {
        throw new Error('expected vextab to be defined on maestro');
      }

      // See id computation in ScoreLine.tsx
      scroller.scrollTo(`score-line-${line.id}-${maestro.vextab.id}`, {
        containerId: 'Score',
        duration: 200,
        ignoreCancelEvents: true,
        smooth: true
      });

      props.setFocusedLine(line);
    }
  }),
  observeMaestro<IInnerProps>(({ handleNotification }) => ({ handleNotification }))
);

export const ScoreScroller = enhance(() => null);
