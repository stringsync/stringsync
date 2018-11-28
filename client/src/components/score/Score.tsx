import * as React from 'react';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { VextabString as VextabStringWrapper } from '../../models/vextab-string';
import { Score as ScoreWrapper } from '../../models/score';

interface IProps {
  vextabString: string;
  width: number;
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
  }),
  lifecycle<InnerProps, {}, {}>({
    shouldComponentUpdate(nextProps) {
      return !!nextProps.div && (
        this.props.vextabString !== nextProps.vextabString ||
        this.props.width !== nextProps.width
      );
    },
    componentDidUpdate(): void {
      if (!this.props.div) {
        return;
      }

      // We have to manually manage the children of the main div
      // since React knows nothing about them
      const { firstChild } = this.props.div;
      if (firstChild) {
        this.props.div.removeChild(firstChild);
      }

      const score = new ScoreWrapper(
        this.props.width,
        this.props.div,
        new VextabStringWrapper(this.props.vextabString).asMeasures(3)
      );

      score.render();
    }
  })
);

export const Score = enhance(props => (
  <div ref={props.handleDivRef} />
));
