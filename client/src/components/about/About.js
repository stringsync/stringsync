import React from 'react';
import styled from 'react-emotion';
import guitarSrc from 'assets/guitar-2048x1152.jpg';
import sonarGuitarSrc from 'assets/sonar-guitar.svg';
import { Icon, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { compose, } from 'recompose';

const enhance = compose(
  connect(
    state => ({
      viewportType: state.viewport.type
    })
  )
);

const Outer = styled('div')`
`;

const Banner = styled(Row)`
  background: ${props => props.theme.primaryColor};
  min-height: ${props => props.height}px;
  width: 100%;
`;

const MainWhiteText = styled('h1')`
  font-size: 1em;
  width: 50%;
  color: ${props => props.theme.tertiaryColor};
  text-align: center;
`;

const About = enhance(() => (
  <Outer>
    <Banner
      type="flex"
      align="middle"
      justify="center"
      height={256}
    >
      <MainWhiteText>
        We created StringSync to help you learn guitar differently
      </MainWhiteText>
    </Banner>
    
  </Outer>
));

export default About;
