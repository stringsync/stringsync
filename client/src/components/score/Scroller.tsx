import * as React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { scroller } from 'react-scroll';
import { Line } from '../../models/score/line/Line';
import { Maestro } from '../../models/maestro/Maestro';
import { get } from 'lodash';
import { subscribeMaestro } from '../../enhancers/subscribeMaestro';

interface IStateProps {
  line: Line | null;
  setLine: (line: Line | null) => void;
}

interface IHandlerProps {
  updateScroller: (maestro: Maestro) => void;
}

type InnerProps = IStateProps & IHandlerProps;

const enhance = compose<InnerProps, {}>(
  withState('line', 'setLine', null),
  withHandlers<IStateProps, IHandlerProps>({
    updateScroller: props => (maestro: Maestro) => {
      const line = get(maestro.currentSpec, 'start.note.measure.line', null);

      if (props.line === line) {
        return;
      }

      if (line) {
        const el = document.getElementById(`line-${line.index}`);
        if (el) {
          scroller.scrollTo(el, {
            smooth: true,
            duration: 100
          });
        }
      }

      props.setLine(line);
    }
  }),
  subscribeMaestro<InnerProps>(props => ({
    name: 'updateScroller',
    callback: props.updateScroller
  }))
);

export const Scroller = enhance(() => null);
