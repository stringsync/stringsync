import React from 'react';
import { compose, setPropTypes, withProps } from 'recompose';
import PropTypes from 'prop-types';
import { times } from 'lodash';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { Fret } from './';

const FIRST_FRET_WIDTH_SCALE_FACTOR = 1.5;
const DOTS = [
  0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
  2, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0
];

const enhance = compose(
  setPropTypes({
    numFrets: PropTypes.number
  }),
  connect(
    state => ({
      viewportType: state.viewport.type
    })
  ),
  withProps(props => {
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

const Frets = enhance(props => (
  <Outer>
    <Fret
      fret={0}
      width={props.firstFretWidth}
      viewportType={props.viewportType}
    />
    {
      times(props.numFrets, ndx => {
        const fretNum = ndx + 1;
        return(
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

export default Frets;
