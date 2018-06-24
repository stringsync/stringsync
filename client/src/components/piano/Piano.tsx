import * as React from 'react';
import styled from 'react-emotion';
import { PianoKeys } from './';

const Outer = styled('div')`
  background: black;
`;

const Piano: React.SFC = () => (
  <Outer>
    <PianoKeys />
  </Outer>
);

export default Piano;
