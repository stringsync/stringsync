import * as React from 'react';
import styled from 'react-emotion';
import { Marker } from './Marker';
import { times } from 'lodash';
import { Fretboard } from '../../../models/fretboard';

interface IProps {
  fret: number;
  fretboard: Fretboard | null;
}

const Outer = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  overflow-x: hidden;
`;

export const Markers: React.SFC<IProps> = props => (
  <Outer className="fretboard-height">
    {times(6, strNdx => {
      const str = strNdx + 1;
      return (
        <Marker
          key={`marker-${str}-${props.fret}`}
          str={str}
          fret={props.fret}
          fretboard={props.fretboard}
        />
      );
    })}
  </Outer>
);
