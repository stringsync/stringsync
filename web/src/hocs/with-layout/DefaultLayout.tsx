import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Layout.Header)`
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
`;

export interface DefaultLayoutProps {
  foo?: string;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = (props) => {
  return (
    <StyledLayout>
      <StyledHeader>{props.foo}</StyledHeader>
      <Layout.Content>
        <main>{props.children}</main>
      </Layout.Content>
      <Layout.Footer></Layout.Footer>
    </StyledLayout>
  );
};

export default DefaultLayout;
