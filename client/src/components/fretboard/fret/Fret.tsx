import * as React from 'react';
import styled from 'react-emotion';
import { Dots } from './Dots';
import { Overlap } from '../../overlap/Overlap';
import { Layer } from '../../overlap/Layer';
import { Markers } from './Markers';
import { Fretboard } from '../../../models/fretboard';

interface IProps {
  fret: number;
  width: number;
  dots: number;
  fretboard: Fretboard;
}

const Outer = styled('div')<{ width: number, fret: number }>`
  width: ${props => props.width}%;
  border-right: ${props => props.fret === 0 ? 4 : 1}px solid #aaaaaa;
  box-shadow: 0 1px 1px 1px #222222;

  &:last-of-type {
    border-right: none;
  }
`;

export const Fret: React.SFC<IProps> = props => (
  <Outer
    width={props.width}
    fret={props.fret}
    className="fretboard-height"
  >
    <Overlap>
      <Layer>
        <Dots dots={props.dots} />
      </Layer>
      <Layer>
        <Markers
          fretboard={props.fretboard}
          fret={props.fret}
        />
      </Layer>
    </Overlap>
  </Outer>
);
