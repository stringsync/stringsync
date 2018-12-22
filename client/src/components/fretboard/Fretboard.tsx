import * as React from 'react';
import { Overlap } from '../overlap/Overlap';
import woodTextureSrc from '../../assets/wood-texture.jpg';
import styled from 'react-emotion';
import { Layer } from '../overlap';
import { Frets } from './fret/Frets';
import { GuitarStrings } from './guitar-strings';
import { compose, withPropsOnChange } from 'recompose';
import { Fretboard as FretboardModel } from '../../models/fretboard';
import { Lighter } from './Lighter';

interface IProps {
  numFrets: number;
}

interface IFretboardProps {
  fretboard: FretboardModel;
}

type InnerProps = IProps & IFretboardProps;

const enhance = compose<InnerProps, IProps>(
  withPropsOnChange(
    ['fretboard'],
    () => ({ fretboard: new FretboardModel() })
  )
);

const Outer = styled('div')`
  background: url(${woodTextureSrc});
  background-color: black;
  width: 100%;

  &, .fretboard-height {
    height: 200px;
  }
`;

export const Fretboard = enhance(props => (
  <Outer>
    <Lighter fretboard={props.fretboard} />
    <Overlap>
      <Layer>
        <Frets
          fretboard={props.fretboard}
          numFrets={props.numFrets}
        />
      </Layer>
      <Layer>
        <GuitarStrings />
      </Layer>
    </Overlap>
  </Outer>
));
