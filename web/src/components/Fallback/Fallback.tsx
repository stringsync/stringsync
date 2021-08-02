import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';

const Outer = styled.div`
  margin-top: 7em;
  text-align: center;
`;

const Icon = styled(LoadingOutlined)`
  font-size: 5em;
`;

export const Fallback: React.FC = () => {
  return (
    <Outer data-testid="fallback">
      <Spin indicator={<Icon type="loading" />} />
    </Outer>
  );
};
