import * as React from 'react';
import styled from 'react-emotion';
import { Layout } from 'antd';
import { Routes } from '../../routes/Routes';

const Inner = styled('div')`
  min-height: 100vh;
`;

export const Content = () => (
  <Layout.Content>
    <Inner>
      <Routes />
    </Inner>
  </Layout.Content>
);
