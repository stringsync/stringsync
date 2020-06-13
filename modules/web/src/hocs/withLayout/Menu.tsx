import React, { useState, useCallback } from 'react';
import { Button, Row, Col, Modal, Avatar } from 'antd';
import Icon from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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

export const Menu: React.FC<Props> = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const showModal = useCallback(() => setModalVisible(true), [setModalVisible]);
  const hideModal = useCallback(() => setModalVisible(false), [setModalVisible]);

  const isLoggedIn = false;
  const isAuthPending = false;
  const isLtEqMdViewport = false;
  const isGtEqTeacher = false;

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
                <MenuIcon type="compass" />
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
              <MenuIcon type="setting" />
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
                <Avatar icon="user" />{' '}
              </Col>
              <Col>
                <div>
                  <Username>@username</Username>
                  <Role>admin</Role>
                </div>
              </Col>
            </Row>
          }
          visible={isModalVisible}
          onCancel={hideModal}
          footer={null}
        >
          <Button block disabled={!isLoggedIn}>
            logout
          </Button>
        </Modal>
      ) : null}
    </>
  );
};
