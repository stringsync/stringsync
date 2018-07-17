import * as React from 'react';
import styled from 'react-emotion';
import { PianoKeys } from './';
import { PianoController } from './PianoController';

const Outer = styled('div')`
  background: black;
`;

export const Piano: React.SFC = () => (
  <Outer>
    <PianoController />
    <PianoKeys />
  </Outer>
);
