import { CustomerServiceOutlined, SearchOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { compose } from '@stringsync/common';
import { Col, Divider, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Box } from '../../../components/Box';
import { Logo } from '../../../components/Logo';
import { Wordmark } from '../../../components/Wordmark';
import { Layout, withLayout } from '../../../hocs';

const LANDING_SRC = 'https://dpwvs3j3j2uwp.cloudfront.net/landing.jpg';

const Outer = styled.div`
  background-color: white;
`;

const Jumbotron = styled.div`
  padding-top: 128px;
  padding-bottom: 128px;
  text-align: center;
  background-image: url("${LANDING_SRC}");
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
`;

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const WhiteBox = styled(Box)`
  width: 55%;
  min-width: 300px;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
  color: ${(props) => props.theme['@primary-color']};
`;

const Header = styled.h1`
  font-size: 3em;
  font-weight: lighter;
  margin-bottom: 0;
  background: white;
`;

const SubHeader = styled.h2`
  font-size: 1.2em;
  margin-bottom: 1em;
`;

const Title = styled.h3`
  color: ${(props) => props.theme['@primary-color']};
`;

const Footer = styled.div`
  padding: 24px 48px;
  text-align: center;
  display: flex;

  svg {
    width: 2.5em;
    height: 2.5em;
    color: ${(props) => props.theme['@secondary-color']};
  }
`;

const enhance = compose(withLayout(Layout.DEFAULT));

export const Landing: React.FC = enhance(() => {
  return (
    <Outer data-testid="landing">
      <Jumbotron>
        <Overlay />
        <WhiteBox>
          <Logo size="5em" />
          <Header>
            <Wordmark />
          </Header>
          <SubHeader>learn how to play guitar for free</SubHeader>
          <Link to="/library" className="ant-btn ant-btn-primary">
            start learning
          </Link>
        </WhiteBox>
      </Jumbotron>

      <Footer>
        <Row align="middle" justify="space-around">
          <Col xs={24} md={6}>
            <ThunderboltOutlined />
            <Title>Learn fast</Title>
            <p>StringSync helps you learn music by making it super easy loop and slow down sections of music.</p>
          </Col>

          <Col xs={0} md={1}>
            <Divider type="vertical" style={{ height: 72 }} />
          </Col>

          <Col xs={24} md={6}>
            <CustomerServiceOutlined />
            <Title>Develop your skills</Title>
            <p>Grow your improvisation skills using our note suggestions.</p>
          </Col>

          <Col xs={0} md={1}>
            <Divider type="vertical" style={{ height: 72 }} />
          </Col>

          <Col xs={24} md={6}>
            <SearchOutlined />
            <Title>Explore music</Title>
            <p>Use our tagging system to find that gospel-metal-jazz sound you've been looking to learn!</p>
          </Col>
        </Row>
      </Footer>
    </Outer>
  );
});
