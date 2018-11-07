import * as React from 'react';
import { Button } from 'antd';
import styled from 'react-emotion';

const StyledDiv = styled('div')`
  color: blue;
`;

export const App = () => (
  <div>
    <StyledDiv>Foobar</StyledDiv>
    <Button type="primary">App</Button>
  </div>
);
