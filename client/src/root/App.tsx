import * as React from 'react';
import styled from 'react-emotion';
import { Layout } from 'antd';
import { Nav } from 'components';
import { ViewportSync } from './';

const Gradient = styled('div')`
  height: 2px;
  background: #FC354C;
  background: linear-gradient(to right, #039E9E, #0ABFBC, #B3FB66, #FC354C);
`;

const LayoutHeader = styled(Layout.Header) `
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

const LayoutContentInner = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
`;

const LayoutFooter = styled(Layout.Footer) `
  text-align: center;
`;

// Sets the layout and routes of the app
const App: React.SFC = () => (
  <main className="app">
    <ViewportSync />
    <Gradient />
    <Layout>
      <LayoutHeader>
        <LayoutHeaderInner>
          <Nav />
        </LayoutHeaderInner>
      </LayoutHeader>
      <Layout.Content>
        <LayoutContentInner>
          routes
        </LayoutContentInner>
      </Layout.Content>
      <LayoutFooter>
        StringSync ©2018 Created by Jared Johnson
      </LayoutFooter>
    </Layout>
  </main>
);

export default App;
