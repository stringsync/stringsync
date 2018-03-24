import React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { Row, Col, Menu, Icon } from 'antd';
import { Logo } from './';

const enhance = compose(

);

const I = styled(Icon)`
  && {
    margin: 0;
  }
`;

const Nav = enhance(props => (
  <Row>
    <Col span={8}>
      <Row type="flex" justify="start">
        <Link to="/">
          <Logo />
        </Link>
      </Row>
    </Col>
    <Col span={16}>
      <Row type="flex" justify="end">
        <Menu
          mode="horizontal"
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">
            <I type="question-circle-o" /> 
          </Menu.Item>
          <Menu.Item key="2">
            <I type="compass" />
          </Menu.Item>
          <Menu.Item key="3">
            <I type="login" />
          </Menu.Item>
        </Menu>
      </Row>
    </Col>
  </Row>
));

export default Nav;
