import * as React from 'react';
import { Selector } from './Selector';
import styled from 'react-emotion';

const Outer = styled('div')`
  padding: 12px 16px;
`;

export const Controls: React.SFC = () => (
  <Outer>
    <Selector />
  </Outer>
);
