import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';

const StyledHeader = styled(Layout.Header)`
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
`;

interface Props {}

const Header: React.FC<Props> = (props) => {
  return <StyledHeader>Hello</StyledHeader>;
};

export default Header;
