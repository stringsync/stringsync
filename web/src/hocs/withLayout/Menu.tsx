import { CompassOutlined, SettingOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, message, Modal, Row } from 'antd';
import React, { useCallback, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { AUTH_ACTIONS, isLoggedInSelector, useAuth } from '../../ctx/auth';
import { useViewport } from '../../ctx/viewport/useViewport';
import { gtEqTeacher } from '../../domain';
import { queries } from '../../graphql';
import { useAsync } from '../../hooks/useAsync';

const StyledRow = styled(Row)`
  svg {
    color: ${(props) => props.theme['@muted']};
  }

  .active-link svg {
    color: ${(props) => props.theme['@primary-color']};
  }
`;

const StyledUploadOutlined = styled(UploadOutlined)`
  font-size: 22px;
`;

const StyledCompassOutlined = styled(CompassOutlined)`
  font-size: 22px;
`;

const StyledSettingOutlined = styled(SettingOutlined)`
  font-size: 22px;
`;

const Username = styled.div`
  font-size: 14px;
`;

const Role = styled.div`
  font-size: 12px;
  font-weight: lighter;
  color: ${(props) => props.theme['@muted']};
`;

interface Props {}

export const Menu: React.FC<Props> = (props) => {
  const [authState, authDispatch] = useAuth();
  const isLoggedIn = isLoggedInSelector(authState);
  const isAuthPending = authState.isPending;
  const user = authState.user;
  const { xs, sm, md } = useViewport();
  const isLtEqMd = xs || sm || md;

  const [isModalVisible, setModalVisible] = useState(false);
  const isGtEqTeacher = gtEqTeacher(user.role);
  const settingsButtonClassName = isModalVisible ? 'active-link' : '';

  const logout = useCallback(async () => {
    authDispatch(AUTH_ACTIONS.reset());
    await queries.logout.fetch();
  }, [authDispatch]);
  const [execLogout] = useAsync(logout);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const onLogoutClick = () => {
    execLogout();
    hideModal();
    message.success('logged out');
  };

  const gutterPx = isLoggedIn ? 16 : 8;
  const isLibraryVisible = !isAuthPending && !isLtEqMd && isLoggedIn;
  const isUploadVisible = !isAuthPending && !isLtEqMd && isLoggedIn && isGtEqTeacher;
  const isLoginVisible = !isAuthPending && !isLoggedIn;
  const isSignupVisible = !isAuthPending && !isLoggedIn;
  const isSettingsVisible = !isAuthPending && isLoggedIn;

  return (
    <>
      <StyledRow justify="center" align="middle" gutter={gutterPx}>
        {isLibraryVisible ? (
          <Col>
            <Button type="link" size="large" shape="circle">
              <NavLink to="/library" activeClassName="active-link">
                <StyledCompassOutlined />
              </NavLink>
            </Button>
          </Col>
        ) : null}

        {isUploadVisible ? (
          <Col>
            <Button type="link" size="large" shape="circle">
              <NavLink to="/upload" activeClassName="active-link">
                <StyledUploadOutlined />
              </NavLink>
            </Button>
          </Col>
        ) : null}

        {isSettingsVisible ? (
          <Col>
            <Button type="link" size="large" shape="circle" onClick={showModal} className={settingsButtonClassName}>
              <StyledSettingOutlined />
            </Button>
          </Col>
        ) : null}

        {isLoginVisible ? (
          <Col>
            <Link to="/login">
              <Button size="small" type="primary">
                login
              </Button>
            </Link>
          </Col>
        ) : null}

        {isSignupVisible ? (
          <Col>
            <Link to="/signup">
              <Button size="small" type="link">
                signup
              </Button>
            </Link>
          </Col>
        ) : null}
      </StyledRow>

      {isLoggedIn ? (
        <Modal
          closable
          closeIcon={null}
          title={
            <Row gutter={8}>
              <Col>
                <Avatar icon={<UserOutlined />} />{' '}
              </Col>
              <Col>
                <div>
                  <Username>{user.username}</Username>
                  <Role>{user.role.toLowerCase()}</Role>
                </div>
              </Col>
            </Row>
          }
          visible={isModalVisible}
          onCancel={hideModal}
          footer={null}
        >
          <Button block onClick={onLogoutClick} disabled={!isLoggedIn}>
            logout
          </Button>
        </Modal>
      ) : null}
    </>
  );
};
