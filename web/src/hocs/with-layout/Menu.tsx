import React, { useState } from 'react';
import { Button, Row, Icon, Col, Modal, Avatar, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthUser } from '../../store/modules/auth';
import { logout } from '../../store/modules/auth/';

const MenuIcon = styled(Icon)`
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

const Menu: React.FC<Props> = (props) => {
  const isLoggedIn = useSelector<RootState, boolean>(
    (state) => state.auth.isLoggedIn
  );
  const user = useSelector<RootState, AuthUser>((state) => state.auth.user);
  const isLtEqMdViewport = useSelector<RootState, boolean>((state) => {
    const { xs, sm, md } = state.viewport;
    return xs || sm || md;
  });
  const isGtEqTeacher = true; // TODO put real logic
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const handleLogoutClick = () => {
    dispatch(logout());
    hideModal();
    message.success('logged out');
  };

  const gutterPx = isLoggedIn ? 16 : 8;

  const isLibraryVisible = !isLtEqMdViewport && isLoggedIn;
  const isUploadVisible = !isLtEqMdViewport && isLoggedIn && isGtEqTeacher;
  const isLoginVisible = !isLoggedIn;
  const isSignupVisible = !isLoggedIn;
  const isSettingsVisible = isLoggedIn;

  return (
    <>
      <Row type="flex" justify="center" align="middle" gutter={gutterPx}>
        {isLibraryVisible ? (
          <Col>
            <Button type="link" size="large" shape="circle">
              <Link to="library">
                <MenuIcon type="compass" theme="filled" />
              </Link>
            </Button>
          </Col>
        ) : null}

        {isUploadVisible ? (
          <Col>
            <Button type="link" size="large" shape="circle">
              <Link to="upload">
                <MenuIcon type="upload" />
              </Link>
            </Button>
          </Col>
        ) : null}

        {isSettingsVisible ? (
          <Col>
            <Button type="link" size="large" shape="circle" onClick={showModal}>
              <MenuIcon type="setting" theme="filled" />
            </Button>
          </Col>
        ) : null}

        {isLoginVisible ? (
          <Col>
            <Link to="login">
              <Button size="small" type="primary">
                login
              </Button>
            </Link>
          </Col>
        ) : null}

        {isSignupVisible ? (
          <Col>
            <Link to="signup">
              <Button size="small" type="link">
                signup
              </Button>
            </Link>
          </Col>
        ) : null}
      </Row>

      {isLoggedIn ? (
        <Modal
          closable
          closeIcon={null}
          title={
            <Row type="flex" gutter={8}>
              <Col>
                <Avatar icon="user" />{' '}
              </Col>
              <Col>
                <div>
                  <Username>@{user.username}</Username>
                  <Role>admin</Role>
                </div>
              </Col>
            </Row>
          }
          visible={isModalVisible}
          onCancel={hideModal}
          footer={null}
        >
          <Button block onClick={handleLogoutClick} disabled={!isLoggedIn}>
            logout
          </Button>
        </Modal>
      ) : null}
    </>
  );
};

export default Menu;
