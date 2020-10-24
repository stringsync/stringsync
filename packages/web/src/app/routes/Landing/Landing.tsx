import { compose } from '@stringsync/common';
import { Button, Col, Divider, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Wordmark } from '../../../components/Wordmark';
import { Layout, withLayout } from '../../../hocs';

const LANDING1_SRC = 'https://dpwvs3j3j2uwp.cloudfront.net/landing1.jpg';

const Outer = styled.div`
  background-color: white;
`;

const Jumbotron = styled.div`
  padding-top: 128px;
  padding-bottom: 128px;
  text-align: center;
  background: white;
`;

const Header = styled.h1`
  font-size: 4em;
  font-weight: lighter;
  margin-bottom: 0;
`;

const SubHeader = styled.h2`
  font-size: 1.5em;
`;

const Title = styled.h3`
  color: ${(props) => props.theme['@primary-color']};
`;

const Img = styled.img`
  width: 100%;
`;

const BreathingRoom = styled.div`
  padding: 24px 48px;
`;

const enhance = compose(withLayout(Layout.DEFAULT));

export const Landing: React.FC = enhance(() => {
  return (
    <Outer data-testid="landing">
      <Jumbotron>
        <Header>
          <Wordmark />
        </Header>
        <SubHeader>learn how to play guitar for free</SubHeader>
        <div>
          <Button type="primary" size="large" href="/library">
            start learning
          </Button>
        </div>
      </Jumbotron>

      <Divider style={{ margin: 0 }} />

      <Row align="middle" justify="space-around">
        <Col sm={24} md={12}>
          <BreathingRoom>
            <Title>Learn fast</Title>
            <p>
              Practice makes perfect. StringSync helps you learn music by making it super easy loop and slow down
              sections of music.
            </p>

            <Title>Develop your skills</Title>
            <p>
              Grow your improvisation skills using our note suggestions. They allow you to tap into the secrets of music
              theory without hours of reading.
            </p>

            <Title>Explore music</Title>
            <p>
              We have a wide variety of music for you to learn and enjoy. Use our tagging system to find that
              gospel-metal-jazz sound you've been looking to learn!
            </p>
          </BreathingRoom>
        </Col>
        <Col sm={24} md={12}>
          <Img src={LANDING1_SRC} alt="landing1" />
        </Col>
      </Row>
    </Outer>
  );
});
