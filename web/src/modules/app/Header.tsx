import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { Wordmark } from '../../components/brand';
import { useRouter } from '../routes/Router';

// hide header for the following paths
const HEADER_BLACKLIST = ['/signup', '/login'];

const StyledHeader = styled(Layout.Header)`
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
`;

interface Props {}

const Header: React.FC<Props> = (props) => {
  const router = useRouter();
  const isHeaderVisible = !HEADER_BLACKLIST.includes(router.location.pathname);

  if (!isHeaderVisible) {
    return null;
  }

  return (
    <StyledHeader>
      <h1>
        <Wordmark />
      </h1>
    </StyledHeader>
  );
};

export default Header;
