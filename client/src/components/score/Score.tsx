import * as React from 'react';
import { compose, withHandlers, withState, EventHandler } from 'recompose';
import { VextabString } from '../../models/vextab-string';
import { Score as ScoreModel } from '../../models/score';

interface IProps {
  src: string;
}

interface IStateProps {
  div: HTMLDivElement | null;
  setDiv: (div: HTMLDivElement | null) => void;
}

interface IHandlerProps {
  handleDivRef: (div: HTMLDivElement) => void;
}

type InnerProps = IProps & IStateProps & IHandlerProps;

const enhance = compose<InnerProps, IProps>(
  withState('div', 'setDiv', null),
  withHandlers<IStateProps, IHandlerProps>({
    handleDivRef: props => div => props.setDiv(div)
  })
);

export const Score = enhance(props => (
  <div ref={props.handleDivRef} />
));
