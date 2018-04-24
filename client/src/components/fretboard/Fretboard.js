import React from 'react';
import { Overlap, Layer } from 'components';
import { Frets, GuitarStrings } from './';

/**
 * Sets up the layout for the Frets and GuitarStrings components
 */
const Fretboard = () => (
  <div>
    <Overlap>
      <Layer>
        <Frets />
      </Layer>
      <Layer>
        <GuitarStrings />
      </Layer>
    </Overlap>
  </div>
);

export default Fretboard;
