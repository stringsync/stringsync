import React from 'react';
import { Layout } from 'antd';
import Routes from '../routes/Routes';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Store, State } from '../../store';

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

interface SelectedState {
  xs: boolean;
  sm: boolean;
  md: boolean;
}

interface Props {}

const App: React.FC<Props> = (props) => {
  const { xs, sm, md } = useSelector<State, SelectedState>((state) => ({
    xs: state.screen.xs,
    sm: state.screen.sm,
    md: state.screen.md,
  }));
  const isFooterVisible = !xs && !sm && !md;
  return (
    <StyledLayout>
      <StyledHeader>Branding</StyledHeader>
      <Layout.Content>
        <main>
          <Routes />
        </main>
      </Layout.Content>
      {isFooterVisible && <StyledFooter>© 2019 StringSync LLC</StyledFooter>}
    </StyledLayout>
  );
};

export default App;
