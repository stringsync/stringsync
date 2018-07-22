import * as React from 'react';
import styled from 'react-emotion';
import { compose, withHandlers, withProps, ComponentEnhancer } from 'recompose';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Menu, Icon } from 'antd';
import { NavLogo } from './NavLogo';
import { connect } from 'react-redux';
import { logout } from 'data';
import { Avatar } from 'components';
import { ViewportTypes } from 'data/viewport/getViewportType';
import { ClickParam } from 'antd/lib/menu';

const { ItemGroup } = Menu;

interface IConnectProps extends RouteComponentProps<{}, {}> {
  session: StringSync.Store.ISessionState;
  viewportType: ViewportTypes;
  logout: () => void;
}

interface IWithHandlersProps extends IConnectProps {
  handleClick: (event: ClickParam) => void;
}

interface IWithProps extends IWithHandlersProps {
  selectedKeys: string[];
}

const enhance: ComponentEnhancer<IWithProps, {}> = compose(
  withRouter,
  connect(
    (state: StringSync.Store.IState) => ({
      session: state.session,
      viewportType: state.viewport.type
    }),
    dispatch => ({
      logout: () => dispatch(logout() as any)
    })
  ),
  withHandlers({
    handleClick: (props: IConnectProps) => (event: ClickParam) => {
      if (event.key.startsWith('/')) {
        props.history.push(event.key);
      } else {
        switch (event.key) {
          case 'logout':
            props.logout();
            window.ss.message.info('logged out');
            props.history.push('/');
            break;
          default:
            break;
        }
      }
    }
  }),
  withProps((props: IWithHandlersProps) => {
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

const StyledSubMenu = styled(Menu.SubMenu)`
  &&& {
    border: 0;
  }
`;

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
              ? <StyledSubMenu
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
                <ItemGroup title={props.session.role}>
                  {
                    props.session.role === 'teacher' || props.session.role === 'admin'
                      ? <StyledMenuItem key="/upload">
                          <Icon type="upload" /> upload
                        </StyledMenuItem>
                      : null
                  }
                  <StyledMenuItem key="logout">
                    <Icon type="logout" /> logout
                  </StyledMenuItem>
              </ItemGroup>
              </StyledSubMenu>
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
