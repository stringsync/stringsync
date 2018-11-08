import * as React from 'react';
import styled from 'react-emotion';
import { Layout } from 'antd';

const Outer = styled(Layout.Header)`
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
`;

const Inner = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = props => (
  <Outer>
    <Inner>
      {props.children}
    </Inner>
  </Outer>
);
