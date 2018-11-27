import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import VT from 'vextab/releases/vextab-div.js';
import { VextabString } from '../../models/vextab-string';
import { Score as ScoreModel } from '../../models/score';

interface IProps {
  src: string;
}

interface IHandlerProps {
  handleDivRef: any;
}

type InnerProps = IHandlerProps & IProps;

const enhance = compose<InnerProps, IProps>(
  withHandlers(() => {
    let div: HTMLCanvasElement;

    return {
      handleDivRef: () => ref => {
        if (!ref) {
          return;
        }

        div = ref;
      }
    };
  })
);

export const Score = enhance(props => (
  <div ref={props.handleDivRef} />
));
