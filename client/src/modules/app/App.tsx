import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose, lifecycle } from 'recompose';
import { Layout } from 'antd';
import { Nav } from 'components';
import styled from 'react-emotion';
import { ViewportSync, SessionSync, Routes } from './';
import { pick, values } from 'lodash';
import { Link } from 'react-router-dom';
import { Element as ScrollElement, scroller } from 'react-scroll';
import { Dispatch, connect } from 'react-redux';
import { UiActions } from 'data';

const enhance = compose(
  withRouter,
  connect(
    null,
    (dispatch: Dispatch) => ({
      focusScrollElement: (element: string) => dispatch(UiActions.focusScrollElement(element))
    })
  ),
  lifecycle<any, {}>({
    componentDidMount(): void {
      // scroll to top on route change
      this.props.history.listen(() => {
        scroller.scrollTo('app-top', {});
        this.props.focusScrollElement('app-top');
      });
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
  font-size: 16px;
  padding-left: 8px;
  padding-right: 8px;
  color: #777;
`;

export const App = enhance(() => (
  <main>
    <ScrollElement name="app-top" />
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
      <StyledLayoutFooter id="footer">
        <FooterLink to="about">about</FooterLink>
        <FooterLink to="teach">teach</FooterLink>
        <FooterLink to="terms">terms</FooterLink>
      </StyledLayoutFooter>
    </Layout>
  </main>
));
