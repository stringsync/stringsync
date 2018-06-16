import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose, lifecycle } from 'recompose';
import { Layout } from 'antd';
import { Nav } from 'components';
import styled from 'react-emotion';
import { ViewportSync, SessionSync, Routes } from './';
import { pick, values } from 'lodash';
import { Link } from 'react-router-dom';

const enhance = compose(
  withRouter,
  lifecycle<RouteComponentProps<{}, {}>, {}>({
    componentDidMount(): void {
      // scroll to top on route change
      this.props.history.listen(() => window.scrollTo(undefined, 0));
    }
  })
);

const colors = ['primaryColor', 'secondaryColor', 'tertiaryColor'];

const Gradient = styled('div')`
  height: 2px;
  background: #FC354C;
  background: linear-gradient(to right, ${props => values(pick(props.theme, colors)).join(', ')});
`;

const LayoutHeader = styled(Layout.Header)`
  background: #fff;
  border-bottom: 1px solid #e8e8e8;

  && {
    padding: 0 20px;
  }
`;

const LayoutHeaderInner = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledLayoutContent = styled(Layout.Content)`
  min-height: 100vh;
`;

const StyledLayoutFooter = styled(Layout.Footer)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  width: 100%;
  height: 64px;
  line-height: 64px;
  border-top: 1px solid ${props => props.theme.borderColor};
`;

const FooterLink = styled(Link)`
  margin: 8px 16px;
  font-size: 16px;
  padding: 4px;
  color: #777;
`;

export const App = enhance(() => (
  <main>
    <ViewportSync />
    <SessionSync />
    <Gradient />
    <Layout>
      <LayoutHeader>
        <LayoutHeaderInner>
          <Nav />
        </LayoutHeaderInner>
      </LayoutHeader>
      <StyledLayoutContent>
        <Routes />
      </StyledLayoutContent>
      <StyledLayoutFooter>
        <FooterLink to="about">about</FooterLink>
        <FooterLink to="teach">teach</FooterLink>
        <FooterLink to="terms">terms</FooterLink>
      </StyledLayoutFooter>
    </Layout>
  </main>
));
