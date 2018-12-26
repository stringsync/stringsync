import * as React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { scroller } from 'react-scroll';
import { Line } from '../../models/score/line/Line';
import { Maestro } from '../../models/maestro/Maestro';
import { get } from 'lodash';
import { subscribeMaestro } from '../../enhancers/subscribeMaestro';
import { connect } from 'react-redux';
import { IStore } from '../../@types/store';
import { ScoreActions } from '../../data/score/scoreActions';

interface IProps {
  offset: number;
}

interface IDispatchProps {
  setScrolling: (scrolling: boolean) => void;
}

interface IStateProps {
  line: Line | null;
  setLine: (line: Line | null) => void;
}

interface IHandlerProps {
  updateScroller: (maestro: Maestro) => void;
}

type InnerProps = IProps & IDispatchProps & IStateProps & IHandlerProps;

const SCROLL_DURATION_MS = 200;

const enhance = compose<InnerProps, IProps>(
  connect<{}, IDispatchProps, {}, IStore>(
    null,
    dispatch => ({
      setScrolling: (scrolling: boolean) => dispatch(ScoreActions.setScrolling(scrolling))
    })
  ),
  withState('line', 'setLine', null),
  withHandlers<IProps & IDispatchProps & IStateProps, IHandlerProps>({
    updateScroller: props => (maestro: Maestro) => {
      const line = get(maestro.currentSpec, 'note.measure.line', null);

      if (props.line === line) {
        return;
      }

      if (line) {
        // Assume that it takes < 100 ms to execute the next lines.
        // This is the mechanism by which StringSync determines if a scroll was
        // produced by a human or not
        props.setScrolling(true);
        window.setTimeout(() => {
          props.setScrolling(false);
        }, SCROLL_DURATION_MS + 100);

        scroller.scrollTo(`line-${line.index}`, {
          smooth: true,
          duration: SCROLL_DURATION_MS,
          offset: -props.offset, // 64 px comes from the nav component
          containerId: 'score-wrapper'
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
