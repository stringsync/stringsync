import * as React from 'react';
import { compose, withState, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import { Score } from 'components';

interface IConnectProps {
  viewportWidth: number;
  notation: Notation.INotation;
}

interface IStateProps extends IConnectProps {
  outerDiv: HTMLDivElement | null;
  setOuterDiv: (outerDiv: HTMLDivElement) => void;
}

interface IOuterDivRefHandlerProps extends IStateProps {
  handleOuterDivRef: (div: HTMLDivElement) => void;
}

interface IInnerProps extends IOuterDivRefHandlerProps {
  scoreWidth: number;
}

const DEFAULT_SCORE_WIDTH = 840; // px

const enhance = compose<IInnerProps, {}>(
  connect(
    (state: Store.IState) => ({
      notation: state.notation,
      viewportWidth: state.viewport.width // causes the scoreWidth to be recalculated
    })
  ),
  withState('outerDiv', 'setOuterDiv', null),
  withHandlers({
    handleOuterDivRef: (props: IStateProps) => (div: HTMLDivElement) => {
      if (!div) {
        return;
      }

      props.setOuterDiv(div);
    }
  }),
  withProps((props: IOuterDivRefHandlerProps) => ({
    scoreWidth: props.outerDiv ? 0.75 * props.outerDiv.clientWidth : DEFAULT_SCORE_WIDTH
  }))
);

export const EditScore = enhance(props => (
  <div ref={props.handleOuterDivRef}>
    <Score
      editor={true}
      dynamic={true}
      notation={props.notation}
      width={props.scoreWidth}
    />
  </div>
));
