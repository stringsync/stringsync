import React from 'react';
import { Layout } from 'antd';
import Routes from '../routes/Routes';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Store } from '../../store';

const StyledLayout = styled(Layout)`
  height: 100vh;
`;

const StyledHeader = styled(Layout.Header)`
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;
`;

const StyledFooter = styled(Layout.Footer)`
  text-align: center;
`;

interface Props {}

const App: React.FC<Props> = (props) => {
  const xs = useSelector<Store, { xs: boolean }>((state) => {});
  return (
    <StyledLayout>
      <StyledHeader>Branding</StyledHeader>
      <Layout.Content>
        <main>
          <Routes />
        </main>
      </Layout.Content>
      <StyledFooter>© 2019 StringSync LLC</StyledFooter>
    </StyledLayout>
  );
};

export default App;
