import React from 'react';
import styled from 'react-emotion';
import { compose, withHandlers, withProps } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, Menu, Icon } from 'antd';
import { NavLogo } from './';
import { connect } from 'react-redux';
import { logout } from 'data';

const enhance = compose(
  withRouter,
  connect(
    state => ({
      session: state.session
    }),
    dispatch => ({
      logout: () => dispatch(logout())
    })
  ),
  withHandlers({
    handleClick: props => event => {
      if (event.key.startsWith('/'))
        props.history.push(event.key);
      else {
        switch(event.key) {
          case 'logout':
            props.logout();
            window.ss.message.info('logged out');
            break;
        }
      }
    }
  }),
  withProps(props => {
    const { pathname } = props.location;
    const selectedKeys = [pathname === '/signup' ? '/login' : pathname];
    return { selectedKeys };
  })
);

const StyledIcon = styled(Icon)`
  && {
    margin: 0;
  }
`;

const SubMenuTitle = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CaretIcon = styled(Icon)`
  font-size: 8px;
  margin-left: 5px;
`;

const CircleImg = styled('img')`
  width: 36px;
  height: 36px;
  background: ${props => props.theme.borderColor};
  margin: 0 8px;
`;

/**
 * Navigation menu for all platforms
 */
const Nav = enhance(props => (
  <Row>
    <Col span={8}>
      <Row type="flex" justify="start">
        <Link to="/">
          <NavLogo />
        </Link>
      </Row>
    </Col>
    <Col span={16}>
      <Row type="flex" justify="end">
        <Menu
          mode="horizontal"
          style={{ lineHeight: '62px' }}
          selectedKeys={props.selectedKeys}
          onClick={props.handleClick}
          multiple={false}
        >
          <Menu.Item key="/about">
            <StyledIcon type="question-circle-o" /> 
          </Menu.Item>
          <Menu.Item key="/">
            <StyledIcon type="home" />
          </Menu.Item>
          {
            props.session.signedIn 
              ? <Menu.SubMenu
                  title={
                    <SubMenuTitle>
                      <div>{props.session.name}</div>
                      {
                        props.session.image
                          ? <div><CircleImg src={props.session.image} /></div>
                          : null
                      }
                      <CaretIcon type="caret-down" />
                    </SubMenuTitle>
                  }
                >
                  <Menu.Item key="logout">
                    logout
                  </Menu.Item>
                </Menu.SubMenu>
              : <Menu.Item key="/login">
                  <StyledIcon type="user" />
                </Menu.Item>
          }
        </Menu>
      </Row>
    </Col>
  </Row>
));

export default Nav;
