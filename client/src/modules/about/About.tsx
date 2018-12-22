import * as React from 'react';
import aboutGuitar1Src from '../../assets/about-guitar-1.jpg';
import aboutGuitar2Src from '../../assets/about-guitar-2.jpg';
import styled from 'react-emotion';
import { Row, Col } from 'antd';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';
import { RowProps } from 'antd/lib/row';
import withSizes from 'react-sizes';
import { Lane } from '../../components/lane/Lane';

const theme = Object.freeze({
  '@primary-color': '#fc354c',
  '@secondary-color': '#6cabba',
  '@tertiary-color': '#f4f4f4',
  '@highlight-color': '#ff9ea9',
  '@background-color-base': '#f0f2f5',
  '@muted': '#e8e8e8'
});

interface IWithSizesProps {
  isDesktop: boolean;
}

const BANNER_COL_SPEC = Object.freeze({
  lg: 9,
  md: 10,
  sm: 12,
  xl: 8,
  xxl: 7,
  xxs: 14,
});

const STACKED_COL_SPEC = Object.freeze({
  lg: 12,
  md: 24,
  sm: 24,
  xl: 12,
  xxl: 12,
  xxs: 24
});

const DEFAULT_YOUTUBE_OPTIONS = Object.freeze({
  playerVars: {
    disablekb: 1,
    fs: 0,
    loop: 1,
    modestbranding: 1,
    playsinline: 1,
    rel: 0,
    showinfo: 0,
    start: 0,
  }
});

const enhance = compose <IWithSizesProps, {}>(
  withSizes(size => ({
    isDesktop: withSizes.isDesktop(size)
  }))
);

interface IColorProps {
  color: string;
}

const MainHeader = styled('h1')<IColorProps>`
  font-size: 2em;
  letter-spacing: 2px;
  text-align: center;
  margin: 36px 24px 36px 24px;
  color: ${props => props.theme[props.color]};
`;

interface IFirstProps {
  first?: boolean;
}

const StyledSection = styled('section') <IFirstProps>`
  margin: 24px;
  margin-top: ${props => !!props.first ? '0' : '24'}px;
  color: black;
`;

const SectionHeader = styled('h2')`
  font-size: 1.25em;
  color: ${props => theme['@primary-color']};
`;

const StyledImg = styled('img')`
  width: 100%;
`;

const StyledLink = styled('span')`
  border-radius: 5px;
  padding: 4px 16px;
  background: ${() => theme['@tertiary-color']};
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

interface IStyledRowProps extends RowProps {
  background: string;
  color?: string;
  height: string | number;
}

const StyledRow: React.SFC<IStyledRowProps> = props => {
  const styleProps = {
    background: theme[props.background],
    color: props.color ? theme[props.color] : null,
    minHeight: props.height
  };

  const restProps = Object.assign({}, props);
  delete restProps.background;
  delete restProps.color;
  delete restProps.height;

  return <Row style={styleProps} {...restProps}>{props.children}</Row>;
};

export const About = enhance(props => (
  <Lane>
    <StyledRow
      type="flex"
      align="middle"
      justify="center"
      background="@primary-color"
      height={256}
    >
      <Col {...BANNER_COL_SPEC}>
        <MainHeader color="@tertiary-color">
          We created StringSync to help you learn guitar differently
        </MainHeader>
      </Col>
    </StyledRow>
    <StyledRow
      type="flex"
      align="middle"
      justify="center"
      background="@tertiary-color"
      height={256}
    >
      <Col {...STACKED_COL_SPEC}>
        <StyledImg src={aboutGuitar1Src} alt="about-guitar-1" />
      </Col>
      <Col {...STACKED_COL_SPEC}>
        <Row type="flex" align="middle" justify="center">
          <Col span={props.isDesktop ? 18 : 24}>
            <StyledSection>
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
      background="@secondary-color"
      color="@tertiary-color"
      height={256}
    >
      <Col span={24}>
        <MainHeader color="@tertiary-color">
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
      background="@tertiary-color"
      color="@primary-color"
      height={256}
    />
    <StyledRow
      type="flex"
      justify="center"
      background="@tertiary-color"
      color="@primary-color"
      height={128}
    >
      <Col {...BANNER_COL_SPEC}>
        <MainHeader color="@primary-color">
          How to learn guitar with StringSync
        </MainHeader>
      </Col>
    </StyledRow>
    <StyledRow
      type="flex"
      justify="center"
      background="@tertiary-color"
      color="@primary-color"
      height={128}
    >
      <Col {...STACKED_COL_SPEC}>
        <Row
          type="flex"
          justify="center"
          align="middle"
        >
          <Col span={props.isDesktop ? 18 : 24}>
            <Row>
              <Col>
                <StyledSection first={true}>
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
      background="@primary-color"
      height={128}
    >
      <StyledLink>
        <Link to="/">Get Started</Link>
      </StyledLink>
    </StyledRow>
  </Lane>
));
