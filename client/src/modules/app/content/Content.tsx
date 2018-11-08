import * as React from 'react';
import styled from 'react-emotion';
import { Layout } from 'antd';

const Inner = styled('div')`
  min-height: 100vh;
`;

export const Content = props => (
  <Layout.Content>
    <Inner>
      {props.children}
    </Inner>
  </Layout.Content>
);
