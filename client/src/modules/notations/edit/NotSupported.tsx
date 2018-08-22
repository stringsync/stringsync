import * as React from 'react';
import styled from 'react-emotion';
import { Alert } from 'antd';
import { MINIMUM_VIEWPORT_WIDTH } from './Edit';

const Outer = styled('div')`
  margin: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const NotSupported = () => (
  <Outer>
    <Alert
      showIcon={true}
      message="error"
      type="error"
      description={`A minimum width of ${MINIMUM_VIEWPORT_WIDTH}px is required for this view. Please increase your screen size.`}
    />
  </Outer>
);