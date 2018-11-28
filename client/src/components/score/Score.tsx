import * as React from 'react';
import { compose, withHandlers, withState, withProps, lifecycle } from 'recompose';
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

interface IMeasuresPerLineProps {
  measuresPerLine: number;
}

type InnerProps = IProps & IStateProps & IHandlerProps & IMeasuresPerLineProps;

const MIN_WIDTH_PER_MEASURE = 240; // px
const MIN_MEASURES_PER_LINE = 1;
const MAX_MEASURES_PER_LINE = 4;

const enhance = compose<InnerProps, IProps>(
  withState('div', 'setDiv', null),
  withHandlers<IStateProps, IHandlerProps>({
    handleDivRef: props => div => props.setDiv(div)
  }),
  withProps((props: any) => {
    let measuresPerLine;

    // compute mpl based on width
    measuresPerLine = Math.floor(props.width / MIN_WIDTH_PER_MEASURE);

    // ensure mpl >= MIN_MEASURES_PER_LINE
    measuresPerLine = Math.max(measuresPerLine, MIN_MEASURES_PER_LINE);

    // ensure mpl <= MAX_MEASURES_PER_LINE
    measuresPerLine = Math.min(measuresPerLine, MAX_MEASURES_PER_LINE);

    return { measuresPerLine };
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
        new VextabStringWrapper(this.props.vextabString).asMeasures(this.props.measuresPerLine)
      );

      score.render();
    }
  })
);

export const Score = enhance(props => <div ref={props.handleDivRef} />);
