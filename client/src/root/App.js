import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, setDisplayName, lifecycle } from 'recompose';
import { Layout, Menu, Breadcrumb } from 'antd';
import styled from 'react-emotion';

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

/**
 * This component sets the layout and routes of the app.
 */
const App = enhance(props => (
  <main className="App">
    <Layout className="layout">
      <Layout.Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Layout.Header>
      <Content>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>Content</div>
      </Content>
      <Footer>
        Ant Design ©2016 Created by Ant UED
    </Footer>
    </Layout>
  </main>
));

const Content = styled(Content)`
  padding: 0 50px;
`;
const Footer = styled(Layout.Footer)`
  text-align: center;
`;

export default App;
