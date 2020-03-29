import React from 'react';
import { Spin } from 'antd';
import Icon from 'antd/lib/icon';
import styled from 'styled-components';
import { SpinProps } from 'antd/lib/spin';

const StyledIcon = styled(Icon)`
  font-size: 5em;
`;

const LoadingIcon = () => {
  return <StyledIcon spin type="loading" />;
};

export const Spinner = (props: SpinProps) => {
  return <Spin indicator={<LoadingIcon />} {...props} />;
};
