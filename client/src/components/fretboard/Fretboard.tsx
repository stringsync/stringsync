import * as React from 'react';
import { Overlap } from '../overlap/Overlap';
import woodTextureSrc from '../../assets/wood-texture.jpg';
import styled from 'react-emotion';
import { Layer } from '../overlap';
import { compose, withProps } from 'recompose';
import withSizes from 'react-sizes';
import { Frets } from './fret/Frets';
import { GuitarStrings } from './guitar-strings';

interface ISizeProps {
  isTablet: boolean;
  isDesktop: boolean;
}

interface IFretProps {
  numFrets: number;
}

type InnerProps = ISizeProps & IFretProps;

const enhance = compose<InnerProps, {}>(
  withSizes(size => ({
    isTablet: withSizes.isTablet(size),
    isDesktop: withSizes.isDesktop(size)
  })),
  withProps<IFretProps, ISizeProps>(props => ({
    numFrets: props.isDesktop ? 21 : props.isTablet ? 19 : 17
  }))
);

const Outer = styled('div')`
  background: url(${woodTextureSrc});
  background-color: black;
  width: 100%;

  &, .fretboard-height {
    height: 12.5vw;
    min-height: 125px;
    max-height: 200px;
  }
`;

export const Fretboard = enhance(() => (
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
));
