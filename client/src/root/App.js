import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, setDisplayName, lifecycle } from 'recompose';
import { Layout } from 'antd';
import { Nav } from 'components';
import styled from 'react-emotion';
import { ViewportSync, Routes } from './';

const enhance = compose(
  setDisplayName('App'),
  withRouter,
  lifecycle({
    componentDidMount() {
      // scroll to top on route change
      this.props.history.listen(() => window.scrollTo(null, 0));
    }
  })
);

const Gradient = styled('div')`
  height: 2px;
  background: #FC354C;
  background: linear-gradient(to right, #039E9E, #0ABFBC, #B3FB66, #FC354C);
`;

const LayoutHeader = styled(Layout.Header)`
  background: #fff;
`;

const LayoutHeaderInner = styled('div')`
  max-width: 980px;
  margin: 0 auto;
`;

const LayoutContent = styled(Layout.Content)`
  min-height: 100vh;
`;

const LayoutFooter = styled(Layout.Footer)`
  text-align: center;
`;

/**
 * This component sets the layout and routes of the app.
 */
const App = enhance(props => (
  <main className="app">
    <ViewportSync />
    <Gradient />
    <Layout>
      <LayoutHeader>
        <LayoutHeaderInner>
          <Nav />
        </LayoutHeaderInner>
      </LayoutHeader>
      <LayoutContent>
        <Routes />
      </LayoutContent>
      <LayoutFooter>
        StringSync ©2018 Created by Jared Johnson
      </LayoutFooter>
    </Layout>
  </main>
));

export default App;
