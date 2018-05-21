import React from 'react';
import styled from 'react-emotion';
import { compose, withHandlers, withProps } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, Menu, Icon } from 'antd';
import { NavLogo } from './';
import { connect } from 'react-redux';
import { logout } from 'data';
import { Avatar } from 'components';

const enhance = compose(
  withRouter,
  connect(
    state => ({
      session: state.session,
      viewportType: state.viewport.type
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

const AvatarContainer = styled('div')`
  margin: 0 8px;
`;

const StyledMenu = styled(Menu)`
  &&& {
    border: 0;
  }
`;

const StyledMenuItem = styled(Menu.Item)`
  &&& {
    border: 0;
  }
`;

/**
 * Navigation menu for all platforms
 */
const Nav = enhance(props => (
  <Row>
    <Col span={4}>
      <Row type="flex" justify="start">
        <Link to="/">
          <NavLogo />
        </Link>
      </Row>
    </Col>
    <Col span={20}>
      <Row type="flex" justify="end">
        <StyledMenu
          mode="horizontal"
          style={{ lineHeight: '62px' }}
          selectedKeys={props.selectedKeys}
          onClick={props.handleClick}
          multiple={false}
        >
          <StyledMenuItem key="/about">
            <StyledIcon type="question-circle-o" /> 
          </StyledMenuItem>
          <StyledMenuItem key="/">
            <StyledIcon type="home" />
          </StyledMenuItem>
          {
            props.session.signedIn 
              ? <Menu.SubMenu
                  title={
                    <SubMenuTitle>
                      {
                        props.viewportType === 'DESKTOP'
                          ? <div>{props.session.name}</div>
                          : null
                      }
                      <AvatarContainer>
                        {<Avatar src={props.session.image} name={props.session.name} />}
                      </AvatarContainer>
                      <CaretIcon type="caret-down" />
                    </SubMenuTitle>
                  }
                >
                  <StyledMenuItem key="logout">
                    logout
                  </StyledMenuItem>
                </Menu.SubMenu>
              : <StyledMenuItem key="/login">
                  <StyledIcon type="user" />
                </StyledMenuItem>
          }
        </StyledMenu>
      </Row>
    </Col>
  </Row>
));

export default Nav;
