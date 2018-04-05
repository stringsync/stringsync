import React from 'react';
import styled from 'react-emotion';
import guitarSrc from 'assets/guitar-2048x1152.jpg';
import sonarGuitarSrc from 'assets/sonar-guitar.svg';
import { Icon, Row, Col } from 'antd';

const Outer = styled('div') `
  max-width: 100%;
  overflow-x: hidden;
  background: white;
`;

const Inner = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px;
`;

const MainImgContainer = styled('div')`
  max-height: 600px;
  overflow: hidden;
`;

const ResponsiveImg = styled('img')`
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
`;

const Logo = styled('h1')`
  font-size: 48px;
  font-weight: 200;
  letter-spacing: 6px;
  margin-bottom: 0;
  color: ${props => props.theme.primaryColor};
  margin-bottom: 0;
`;

const TitleRow = styled('div')`
  margin-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Title = styled('h1') `
  font-size: 36px;
  font-weight: 200;
  margin-bottom: 0;
`;

const About = () => (
  <Outer>
    <MainImgContainer>
      <ResponsiveImg src={guitarSrc} alt="guitar" />
    </MainImgContainer>
    <Inner>
      <TitleRow>
        <Logo className="main-title">StringSync</Logo>
        <Title>&nbsp;learn guitar quickly</Title>
      </TitleRow>
    </Inner>
  </Outer>
);

export default About;
