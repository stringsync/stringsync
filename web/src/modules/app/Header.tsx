import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';

const StyledHeader = styled(Layout.Header)`
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
`;

interface Props {}

const Header: React.FC<Props> = (props) => {
  return (
    <StyledHeader>
      <Link to="/">home</Link>
      <Link to="/library">library</Link>
      <Link to="/signup">signup</Link>
      <Link to="/login">login</Link>
    </StyledHeader>
  );
};

export default Header;
