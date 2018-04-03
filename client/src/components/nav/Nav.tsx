import * as React from 'react';
import styled from 'react-emotion';
import { Row, Col, Icon, Menu } from 'antd';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

const enhance = compose(

);

const I = styled(Icon) `
  && {
    margin: 0;
  }
`;

// Navigation menu for all platforms
const Nav = enhance(props => (
  <Row>
    <Col span={8}>
      <Row type="flex" justify="start">
        <Link to="/">
          Logo
        </Link>
      </Row>
    </Col>
    <Col span={16}>
      <Row type="flex" justify="end">
        <Menu
          mode="horizontal"
          style={{ lineHeight: '62px' }}
          selectedKeys={undefined}
          onClick={undefined}
          multiple={false}
        >
          <Menu.Item key="/about">
            <I type="question-circle-o" />
          </Menu.Item>
          <Menu.Item key="/">
            <I type="home" />
          </Menu.Item>
          <Menu.Item key="/login">
            <I type="user" />
          </Menu.Item>
        </Menu>
      </Row>
    </Col>
  </Row>
));

export default Nav;
