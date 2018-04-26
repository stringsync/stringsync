import React from 'react';
import styled from 'react-emotion';
import { compose, withHandlers, setPropTypes, withProps } from 'recompose';
import { connect } from 'react-redux';
import { Icon, Row, Col } from 'antd';
import { MiniNotationDetail, Scrubber, PlayToggle, MenuToggle } from './';
import PropTypes from 'prop-types';

const enhance = compose (
  setPropTypes({
    onMenuClick: PropTypes.func.isRequired
  }),
  connect(
    state => ({
      videoPlayer: state.video.player,
      isVideoActive: state.video.isActive,
    })
  ),
  withHandlers({
    onPauseClick: props => event => {
      props.videoPlayer.playVideo();
    },
    onPlayClick: props => event => {
      props.videoPlayer.pauseVideo();
    }
  }),
  withProps(props => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const ratio = window.devicePixelRatio || 1;
    const screen = {
      width: window.screen.width * ratio,
      height: window.screen.height * ratio
    };

    const isIphoneX = iOS && screen.width == 1125 && screen.height === 2436;

    return { isIphoneX }
  })
);

const Outer = styled('div')`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  z-index: 11;
  margin-bottom: ${props => props.isIphoneX ? '12px' : '0'};
`;

const Inner = styled('div')`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
`;

const PlayerButton = styled('button')`
  width: 24px;
  height: 100%;
  margin: 0 12px 0 12px;
  padding: 0;
  border: 0;
  background-color: transparent;
  cursor: pointer;

  &:focus {
    outline: 0;
  }

  i {
    font-size: 24px;
  }
`;

const SliderContainer = styled('div')`
  width: 100%;
`;

const DetailContainer = styled('div')`
  margin-right: 12px;
`;

const NotationShowControls = enhance(props => (
  <Outer isIphoneX={props.isIphoneX}>
    <Inner>
      <PlayerButton>
        <PlayToggle />
      </PlayerButton>
      <SliderContainer>
        <Scrubber />
      </SliderContainer>
      <PlayerButton>
        <MenuToggle
          menuCollapsed={props.menuCollapsed}
          onMenuClick={props.onMenuClick}
        />
      </PlayerButton>
      <DetailContainer>
        <Row>
          <Col xs={0} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <MiniNotationDetail />
          </Col>
        </Row>
      </DetailContainer>
    </Inner>
  </Outer>
));

export default NotationShowControls;
