import React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { compose, withProps, withHandlers } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, Menu, Icon } from 'antd';
import { Logo } from './';

const enhance = compose(
  withRouter,
  withHandlers({
    handleClick: props => event => {
      props.history.push(event.key);
    }
  })
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
          selectedKeys={[props.match.path]}
          onClick={props.handleClick}
        >
          <Menu.Item key="/about">
            <I type="question-circle-o" /> 
          </Menu.Item>
          <Menu.Item key="/">
            <I type="compass" />
          </Menu.Item>
          <Menu.Item key="/login">
            <I type="login" />
          </Menu.Item>
        </Menu>
      </Row>
    </Col>
  </Row>
));

export default Nav;
