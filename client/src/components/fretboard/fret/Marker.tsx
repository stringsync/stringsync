import * as React from 'react';
import { compose, withStateHandlers, StateHandler, withProps } from 'recompose';
import { Flow } from 'vextab/releases/vextab-div.js';
import styled from 'react-emotion';

interface IProps {
  str: number;
  fret: number;
}

type FretMarkerState = 'LIT' | 'PRESSED' | 'HIDDEN';

interface IStateProps {
  markerState: FretMarkerState;
}

interface IHandlerProps {
  [light: string]: StateHandler<IStateProps>;
  unlight: StateHandler<IStateProps>;
  press: StateHandler<IStateProps>;
  unpress: StateHandler<IStateProps>;
}

type WithStateHandlerProps = IStateProps & IHandlerProps;

interface INoteProps {
  noteLiteral: string;
}

type InnerProps = IProps & WithStateHandlerProps & INoteProps;

const TUNING = new (Flow as any).Tuning();

const enhance = compose<InnerProps, IProps>(
  withStateHandlers<IStateProps, IHandlerProps, IProps>(
    { markerState: 'HIDDEN' },
    {
      light: () => () => ({ markerState: 'LIT' }),
      unlight: () => () => ({ markerState: 'HIDDEN' }),
      press: () => () => ({ markerState: 'PRESSED' }),
      unpress: () => () => ({ markerState: 'LIT' })
    }
  ),
  withProps<INoteProps, IProps & WithStateHandlerProps>(props => ({
    noteLiteral: TUNING.getNoteForFret(props.fret, props.str).split('/')[0]
  }))
);

const Outer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: lime;
  box-sizing: border-box;
  font-size: 0.75em;
  font-weight: 700;
  width: 2em;
  height: 2em;
  z-index: 2;
`;

export const Marker = enhance(props => (
  <Outer>{props.noteLiteral}</Outer>
));
