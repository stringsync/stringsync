import React from 'react';
import aboutGuitar1Src from 'assets/about-guitar-1.jpg';
import aboutGuitar2Src from 'assets/about-guitar-2.jpg';
import guitarSrc from 'assets/guitar-2048x1152.jpg';
import sonarGuitarSrc from 'assets/sonar-guitar.svg';
import styled from 'react-emotion';
import { Icon, Row, Col } from 'antd';
import { compose, } from 'recompose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';

const BANNER_COL_SPEC = Object.freeze({
  xxs: 14,
  sm: 12,
  md: 10,
  lg: 9,
  xl: 8,
  xxl: 7
});

const STACKED_COL_SPEC = Object.freeze({
  xxs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 12,
  xxl: 12
});

const DEFAULT_YOUTUBE_OPTIONS = Object.freeze({
  playerVars: {
    modestbranding: 1,
    playsinline: 1,
    rel: 0,
    showinfo: 0,
    disablekb: 1,
    fs: 0,
    start: 0,
    loop: 1,
  }
});

const enhance = compose(
  connect(
    state => ({
      viewportType: state.viewport.type
    })
  )
);

const Outer = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledRow = styled(Row)`
  background: ${props => props.theme[props.background]};
  color: ${props => props.theme[props.color]};
  min-height: ${props => props.height}px;
  width: 100%;
  position: relative;
`;

const MainHeader = styled('h1')`
  font-size: 2em;
  letter-spacing: 2px;
  text-align: center;
  margin: 36px 24px 36px 24px;
  color: ${props => props.theme[props.color]};
`;

const StyledSection = styled('section')`
  margin: 24px;
  margin-top: ${props => props.first ? '0' : '24'}px;
  color: ${props => props.theme.quaternaryColor};
`;

const SectionHeader = styled('h2')`
  font-size: 1.25em;
  color: ${props => props.theme.primaryColor};
`;

const StyledImg = styled('img')`
  width: 100%;
`;

const StyledLink = styled(Link)`
  border-radius: 5px;
  padding: 4px 16px;
  background: ${props => props.theme.tertiaryColor};
  font-size: 24px;
`;

const VideoContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 120;
  z-index: 5;
  width: 100%;

  iframe {
    max-width: 100vw;
  }
`;

const About = enhance(props => (
  <Outer>
    <StyledRow
      type="flex"
      align="middle"
      justify="center"
      background="primaryColor"
      height={256}
    >
      <Col {...BANNER_COL_SPEC}>
        <MainHeader
          viewportType={props.viewportType}
          color="tertiaryColor"
        >
          We created StringSync to help you learn guitar differently
        </MainHeader>
      </Col>
    </StyledRow>
    <StyledRow
      type="flex"
      align="middle"
      justify="center"
      background="tertiaryColor"
      height={256}
    >
      <Col {...STACKED_COL_SPEC}>
        <StyledImg src={aboutGuitar1Src} alt="about-guitar-1" />
      </Col>
      <Col {...STACKED_COL_SPEC}>
        <Row type="flex" align="middle" justify="center">
          <Col span={props.viewportType === 'DESKTOP' ? 18 : 24}>
            <StyledSection viewportType={props.viewportType}>
              <SectionHeader>We believe that learning music should be simple</SectionHeader>
              <p>
                While traditional guitar teaching methods can be a bit inefficient, StringSync
                allows you to hear, see, and play &mdash; at the same time.
              </p>
            </StyledSection>
          </Col>
        </Row>
      </Col>
    </StyledRow>
    <StyledRow
      type="flex"
      justify="center"
      background="secondaryColor"
      color="tertiaryColor"
      height={256}
    >
      <Col span={24}>
        <MainHeader
          color="tertiaryColor"
          viewportType={props.viewportType}
        >
          It's easy
        </MainHeader>
        <VideoContainer>
          <YouTube
            opts={DEFAULT_YOUTUBE_OPTIONS}
            videoId="aJS7OIFPUQc"
          />
        </VideoContainer>
      </Col>
    </StyledRow>
    <StyledRow
      background="tertiaryColor"
      color="primaryColor"
      height={256}
    />
    <StyledRow
      type="flex"
      justify="center"
      background="tertiaryColor"
      color="primaryColor"
      height={128}
    >
      <Col {...BANNER_COL_SPEC}>
        <MainHeader
          color="primaryColor"
          viewportType={props.viewportType}
        >
          How to learn guitar with StringSync
        </MainHeader>
      </Col>
    </StyledRow>
    <StyledRow
      type="flex"
      justify="center"
      background="tertiaryColor"
      color="primaryColor"
      height={128}
    >
      <Col {...STACKED_COL_SPEC}>
        <Row
          type="flex"
          justify="center"
          align="middle"
        >
          <Col span={props.viewportType === 'DESKTOP' ? 18 : 24}>
            <Row>
              <Col>
                <StyledSection first>
                  <SectionHeader>Learn fast</SectionHeader>
                  <p>
                    Practice makes perfect. StringSync helps you learn music by making it super easy
                    loop and slow down sections of music.
                  </p>
                </StyledSection>
              </Col>
              <Col>
                <StyledSection>
                  <SectionHeader>Develop your skills</SectionHeader>
                  <p>
                    Grow your improvisation skills using our note suggestions. They allow you
                    to tap into the secrets of music theory without hours of reading.
                  </p>
                </StyledSection>
              </Col>
              <Col>
                <StyledSection>
                  <SectionHeader>Explore music</SectionHeader>
                  <p>
                    We have a wide variety of music for you to learn and enjoy. Use our tagging system
                    to find that gospel-metal-jazz sound you've been looking to learn!
                  </p>
                </StyledSection>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col {...STACKED_COL_SPEC}>
        <StyledImg src={aboutGuitar2Src} alt="about-guitar-2" />
      </Col>
    </StyledRow>
    <StyledRow
      type="flex"
      align="middle"
      justify="center"
      background="primaryColor"
      height={128}
    >
      <StyledLink to="/">
        Get Started
      </StyledLink>
    </StyledRow>
  </Outer>
));

export default About;
