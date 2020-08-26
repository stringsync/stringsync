import { CompassOutlined, SettingOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { gtEqTeacher } from '@stringsync/domain';
import { Avatar, Button, Col, message, Modal, Row } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AppDispatch, AuthUser, isLoggedInSelector, logout, RootState } from '../../store';

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
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector<RootState, boolean>(isLoggedInSelector);
  const isAuthPending = useSelector<RootState, boolean>((state) => state.auth.isPending);
  const isLtEqMdViewport = useSelector<RootState, boolean>((state) => {
    const { xs, sm, md } = state.viewport;
    return xs || sm || md;
  });
  const user = useSelector<RootState, AuthUser>((state) => state.auth.user);

  const [isModalVisible, setModalVisible] = useState(false);
  const history = useHistory();
  const isGtEqTeacher = gtEqTeacher(user.role);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const handleLogoutClick = () => {
    dispatch(logout());
    hideModal();
    message.success('logged out');
    history.push('library');
  };

  const gutterPx = isLoggedIn ? 16 : 8;
  const isLibraryVisible = !isAuthPending && !isLtEqMdViewport && isLoggedIn;
  const isUploadVisible = !isAuthPending && !isLtEqMdViewport && isLoggedIn && isGtEqTeacher;
  const isLoginVisible = !isAuthPending && !isLoggedIn;
  const isSignupVisible = !isAuthPending && !isLoggedIn;
  const isSettingsVisible = !isAuthPending && isLoggedIn;

  return (
    <>
      <Row justify="center" align="middle" gutter={gutterPx}>
        {isLibraryVisible ? (
          <Col>
            <Button type="link" size="large" shape="circle">
              <Link to="library">
                <StyledCompassOutlined />
              </Link>
            </Button>
          </Col>
        ) : null}

        {isUploadVisible ? (
          <Col>
            <Button type="link" size="large" shape="circle">
              <Link to="upload">
                <StyledUploadOutlined />
              </Link>
            </Button>
          </Col>
        ) : null}

        {isSettingsVisible ? (
          <Col>
            <Button type="link" size="large" shape="circle" onClick={showModal}>
              <StyledSettingOutlined />
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
          <Button block onClick={handleLogoutClick} disabled={!isLoggedIn}>
            logout
          </Button>
        </Modal>
      ) : null}
    </>
  );
};
