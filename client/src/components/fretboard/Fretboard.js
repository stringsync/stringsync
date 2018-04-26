import React from 'react';
import { Overlap, Layer } from 'components';
import { Frets, GuitarStrings } from './';
import styled from 'react-emotion';
import woodTextureSrc from 'assets/wood-texture.jpg';

const Outer = styled('div')`
  background: url(${props => woodTextureSrc});
  background-color: black;
`;

/**
 * Sets up the layout for the Frets and GuitarStrings components
 */
const Fretboard = () => (
  <Outer>
    <Overlap>
      <Layer>
        <Frets />
      </Layer>
      <Layer>
        <GuitarStrings />
      </Layer>
    </Overlap>
  </Outer>
);

export default Fretboard;
