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

const StyledRow = styled(Row)`
  background: ${props => props.theme[props.color]};
  min-height: ${props => props.minHeight}px;
  width: 100%;
`;

const MainWhiteText = styled('h1')`
  font-size: 1.5em;
  color: ${props => props.theme.tertiaryColor};
  text-align: center;
`;

const About = enhance(props => (
  <Outer>
    <StyledRow
      type="flex"
      align="middle"
      justify="center"
      color="primaryColor"
      minHeight={256}
    >
      <Col xxs={7} sm={6} md={5} lg={5} xl={4} xxl={3}>
        <MainWhiteText viewportType={props.viewportType}>
          We created StringSync to help you learn guitar differently
        </MainWhiteText>
      </Col>
    </StyledRow>
    <StyledRow
      color="tertiaryColor"
      minHeight={256}
    >
    
    </StyledRow>

  </Outer>
));

export default About;
