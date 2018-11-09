import * as React from 'react';
import { ContentLane } from '../../../components/content-lane/ContentLane';
import styled from 'react-emotion';

const CodeBox = styled('div')`
  border: 1px;
  border-radius: 2px;
  background: white;
`;

export const Login = () => (
  <ContentLane withPadding={true} withTopMargin={true}>
    <CodeBox>Login</CodeBox>
  </ContentLane>
);
