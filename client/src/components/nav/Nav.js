import React from 'react';
import styled from 'react-emotion';
import { compose, withHandlers } from 'recompose';
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

/**
 * Navigation menu for all platforms
 */
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
          style={{ lineHeight: '62px' }}
          selectedKeys={[props.location.pathname]}
          onClick={props.handleClick}
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
