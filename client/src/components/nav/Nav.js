import React from 'react';
import styled from 'react-emotion';
import { Row, Col, Menu } from 'antd';

const NavLeft = styled(Col) `
  display: flex;
  justify-content: flex-start;
`;

const NavRight = styled(Col) `
  display: flex;
  justify-content: flex-end;
`;

const Nav = () => (
  <Row>
    <NavLeft span={12}>
      StringSync
    </NavLeft>
    <NavRight span={12}>
      <Menu
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="1">nav 1</Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu>
    </NavRight>
  </Row>
);

export default Nav;
