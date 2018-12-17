import * as React from 'react';
import { Overlap } from '../overlap/Overlap';
import woodTextureSrc from '../../assets/wood-texture.jpg';
import styled from 'react-emotion';
import { Layer } from '../overlap';
import { Frets } from './fret/Frets';
import { GuitarStrings } from './guitar-strings';

interface IProps {
  numFrets: number;
}

const Outer = styled('div')`
  background: url(${woodTextureSrc});
  background-color: black;
  width: 100%;

  &, .fretboard-height {
    height: 200px;
  }
`;

export const Fretboard: React.SFC<IProps> = props => (
  <Outer>
    <Overlap>
      <Layer>
        <Frets numFrets={props.numFrets} />
      </Layer>
      <Layer>
        <GuitarStrings />
      </Layer>
    </Overlap>
  </Outer>
);
