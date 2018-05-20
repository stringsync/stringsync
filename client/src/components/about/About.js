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

const BANNER_COL_SPEC = Object.freeze({
  xxs: 14,
  sm: 12,
  md: 10,
  lg: 8,
  xl: 6,
  xxl: 5
});

const STACKED_COL_SPEC = Object.freeze({
  xxs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 12,
  xxl: 12
});

const enhance = compose(
  connect(
    state => ({
      viewportType: state.viewport.type
    })
  )
);

const StyledRow = styled(Row)`
  background: ${props => props.theme[props.background]};
  color: ${props => props.theme[props.color]};
  min-height: ${props => props.height}px;
  width: 100%;
`;

const MainHeader = styled('h1')`
  font-size: 1.5em;
  text-align: center;
  margin: 24px;
  color: ${props => props.theme[props.color]};
`;

const StyledSection = styled('section')`
  margin: 48px 0;
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

const About = enhance(props => (
  <div>
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
          <Col span={16}>
            <StyledSection viewportType={props.viewportType}>
              <SectionHeader>we crafted a tool that simplifies learning guitar</SectionHeader>
              <p>
                We believe learning music should be simple. While traditional guitar teaching methods
                can be a bit inefficient, StringSync allows you to hear, see, and play - at the same
                time.
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
      height={512}
    >
      <Col {...BANNER_COL_SPEC}>
        <MainHeader
          color="tertiaryColor"
          viewportType={props.viewportType}
        >
          It's so easy
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
        <Row>
          <Col span={16}>
            <ul>
              <li>
                <h2>learn fast</h2>
                <p>
                  lorem ipsum dolor sit amet, consectetuer
                  lorem ipsum dolor sit amet, consectetuer
                  lorem ipsum dolor sit amet, consectetuer
                  lorem ipsum dolor sit amet, consectetuer
                </p>
              </li>
              <li>
                <h2>learn fast</h2>
                <p>
                  lorem ipsum dolor sit amet, consectetuer
                  lorem ipsum dolor sit amet, consectetuer
                  lorem ipsum dolor sit amet, consectetuer
                  lorem ipsum dolor sit amet, consectetuer
                </p>
              </li>
              <li>
                <h2>learn fast</h2>
                <p>
                  lorem ipsum dolor sit amet, consectetuer
                  lorem ipsum dolor sit amet, consectetuer
                  lorem ipsum dolor sit amet, consectetuer
                  lorem ipsum dolor sit amet, consectetuer
                </p></li>
            </ul>
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
      height={256}
    >
      <StyledLink to="/">
        Get Started
      </StyledLink>
    </StyledRow>
  </div>
));

export default About;
