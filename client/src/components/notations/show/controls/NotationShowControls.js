import React from 'react';
import styled from 'react-emotion';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Icon, Row, Col, Slider } from 'antd';
import { MiniNotationDetail } from './';

const enhance = compose (
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
`;

const Inner = styled('div')`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
`;

const PlayerBtn = styled('button')`
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
  <Outer>
    <Inner>
      <PlayerBtn>
        <Icon type="play-circle-o" />
      </PlayerBtn>
      <SliderContainer>
        <Slider 
          style={{ margin: '0 4px 0 4px' }}
        />
      </SliderContainer>
      <PlayerBtn>
        <Icon type="setting" />
      </PlayerBtn>
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
