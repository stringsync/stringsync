import React from 'react';
import { Overlap, Layer } from 'components';
import { Frets, GuitarStrings } from './';
import styled from 'react-emotion';
import woodTextureSrc from 'assets/wood-texture.jpg';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

const enhance = compose(
  connect(
    state => ({
      viewportType: state.viewport.type
    })
  ),
  withProps(props => {
    let numFrets;
    switch(props.viewportType) {
      case 'MOBILE':
        numFrets = 17;
        break;
      case 'TABLET':
        numFrets = 19;
        break;
      case 'DESKTOP':
        numFrets = 21;
        break;
      default:
        numFrets = 19;
        break;
    };

    return { numFrets };
  })
);

const Outer = styled('div')`
  background: url(${props => woodTextureSrc});
  background-color: black;
  width: 100%;

  &, .fretboard-height {
    height: 12.5vw;
    min-height: 125px;
    max-height: 200px;
  }
`;

/**
 * Sets up the layout for the Frets and GuitarStrings components
 */
const Fretboard = enhance(props => (
  <Outer>
    <Overlap>
      <Layer>
        <Frets numFrets={props.numFrets} />
      </Layer>
      <Layer>
        <GuitarStrings numStrings={6} />
      </Layer>
    </Overlap>
  </Outer>
));

export default Fretboard;
