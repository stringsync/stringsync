import * as React from 'react';
import { GuitarString } from './GuitarString';
import styled from 'react-emotion';

// the first string corresponds to the high pitched e string
const STRING_HEIGHTS_PX = [1, 1, 1, 2, 2, 3];
const STRING_NUMBERS = [1, 2, 3, 4, 5, 6];

const Outer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  overflow-x: hidden;
`;

export const GuitarStrings = () => (
  <Outer className="fretboard-height">
    {STRING_NUMBERS.map(str => (
      <GuitarString
        key={`guitar-string-${str}`}
        height={STRING_HEIGHTS_PX[str - 1]}
      />
    ))}
  </Outer>
);
