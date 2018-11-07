import * as React from 'react';
import { Button } from 'antd';
import styled from 'react-emotion';
import { Example } from '../../components/example';

const StyledDiv = styled('div')`
  color: blue;
`;

export const App = () => (
  <div>
    <Example disabled={false} label="foo" />
    <StyledDiv>Foobar</StyledDiv>
    <Button type="primary">App</Button>
  </div>
);
