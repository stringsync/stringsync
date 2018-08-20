import * as React from 'react';
import { compose, withProps } from 'recompose';
import { times } from 'lodash';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { Fret } from './Fret';
import { ViewportTypes } from 'data/viewport/getViewportType';

interface IOuterProps {
  numFrets: number;
}

interface IConnectProps extends IOuterProps {
  viewportType: ViewportTypes;
}

interface IInnerProps extends IConnectProps {
  fretWidth: number;
  firstFretWidth: number;
}

const FIRST_FRET_WIDTH_SCALE_FACTOR = 1.5;
const DOTS = [
  0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
  2, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0
];

const enhance = compose<IInnerProps, IOuterProps>(
  connect(
    (state: Store.IState) => ({
      viewportType: state.viewport.type
    })
  ),
  withProps((props: IConnectProps) => {
    // solved y + xn = 100 where y is the width of the first fret, x is the width
    // of a single fret, and n is the number of frets
    const fretWidth = 100 / (FIRST_FRET_WIDTH_SCALE_FACTOR + props.numFrets);
    const firstFretWidth = fretWidth * FIRST_FRET_WIDTH_SCALE_FACTOR;

    return { fretWidth, firstFretWidth };
  })
);

const Outer = styled('div')`
  display: flex;
  width: 100%;
`;

export const Frets = enhance(props => (
  <Outer>
    <Fret
      fret={0}
      width={props.firstFretWidth}
      viewportType={props.viewportType}
      dots={0}
    />
    {
      times(props.numFrets, ndx => {
        const fretNum = ndx + 1;
        return (
          <Fret
            key={`fret-${fretNum}`}
            fret={fretNum}
            width={props.fretWidth}
            viewportType={props.viewportType}
            dots={DOTS[fretNum]}
          />
        );
      })
    }
  </Outer>
));
