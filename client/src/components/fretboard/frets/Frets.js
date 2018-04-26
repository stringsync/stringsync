import React from 'react';
import { compose, setPropTypes, withProps } from 'recompose';
import PropTypes from 'prop-types';
import { times } from 'lodash';
import styled from 'react-emotion';
import { connect } from 'react-redux';

const FIRST_FRET_WIDTH_SCALE_FACTOR = 1.5;

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

const Fret = styled('div')`
  width: ${props => `${props.width}%`};
  border-right: ${props => props.fret === 0 ? 4 : props.viewportType === 'MOBILE' ? 1 : 2}px solid #aaa;
  box-shadow: 0 1px 1px 1px #222;
`;

const Frets = enhance(props => (
  <Outer>
    <Fret
      fret={0}
      className="fretboard-height"
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
            className="fretboard-height"
            width={props.fretWidth}
            viewportType={props.viewportType}
          />
        );
      })
    }
  </Outer>
));

export default Frets;
