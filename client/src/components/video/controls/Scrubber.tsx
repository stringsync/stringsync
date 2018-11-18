import * as React from 'react';
import { Slider } from 'antd';
import styled from 'react-emotion';

const Outer = styled('div')`
  padding: 0 16px 2px 16px;
`;

export const Scrubber = () => (
  <Outer>
    <Slider />
  </Outer>
);
