import * as React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { scroller } from 'react-scroll';
import { Line } from '../../models/score/line/Line';
import { Maestro } from '../../models/maestro/Maestro';
import { get } from 'lodash';
import { subscribeMaestro } from '../../enhancers/subscribeMaestro';

interface IProps {
  offset: number;
}

interface IStateProps {
  line: Line | null;
  setLine: (line: Line | null) => void;
}

interface IHandlerProps {
  updateScroller: (maestro: Maestro) => void;
}

type InnerProps = IProps & IStateProps & IHandlerProps;

const enhance = compose<InnerProps, IProps>(
  withState('line', 'setLine', null),
  withHandlers<IProps & IStateProps, IHandlerProps>({
    updateScroller: props => (maestro: Maestro) => {
      const line = get(maestro.currentSpec, 'stop.note.measure.line', null);

      if (props.line === line) {
        return;
      }

      if (line) {
        scroller.scrollTo(`line-${line.index}`, {
          smooth: true,
          duration: 200,
          offset: -props.offset - 80
        });
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
