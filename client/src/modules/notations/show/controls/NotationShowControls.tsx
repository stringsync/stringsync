import * as React from 'react';
import styled from 'react-emotion';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { connect } from 'react-redux';
import { Row, Col, Collapse, Tooltip } from 'antd';
import { MiniNotationDetail, Scrubber, PlayToggle, MenuToggle } from './';
import { Loop } from './Loop';
import { ShowLoop } from './ShowLoop';

const { Panel } = Collapse;

interface IRow2Props {
  menuCollapsed: boolean;
  onMenuClick: (event: React.SyntheticEvent<HTMLElement>) => void;
}

interface IInnerProps extends IRow2Props {
  isVideoActive: boolean;
  videoPlayer: Youtube.IPlayer;
  isIphoneX: boolean;
  loopCollapsed: boolean;
  handleLoopCollapseChange: () => void;
  setLoopCollapsed: (collapsed: boolean) => void;
}

const enhance = compose<IInnerProps, IRow2Props>(
  connect(
    (state: StringSync.Store.IState) => ({
      isVideoActive: state.video.isActive,
      videoPlayer: state.video.player
    })
  ),
  withState('loopCollapsed', 'setLoopCollapsed', true),
  withHandlers({
    handleLoopCollapseChange: (props: any) => () => {
      props.setLoopCollapsed(!props.loopCollapsed);
    }
  }),
  withHandlers({
    onPauseClick: (props: any) => (event: React.SyntheticEvent<HTMLElement>) => {
      props.videoPlayer.playVideo();
    },
    onPlayClick: (props: any) => (event: React.SyntheticEvent<HTMLElement>) => {
      props.videoPlayer.pauseVideo();
    }
  }),
  withProps(props => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const ratio = window.devicePixelRatio || 1;
    const screen = {
      height: window.screen.height * ratio,
      width: window.screen.width * ratio,
    };

    const isIphoneX = iOS && screen.width === 1125 && screen.height === 2436;

    return { isIphoneX }
  })
);

const Outer = styled('div')`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  z-index: 12;
  background: #fff;
  padding-bottom: 12px;
`;

const Row1 = styled('div')`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

interface IRow2DivProps {
  isIphoneX: boolean;
}

const Row2 = styled('div')<IRow2DivProps>`
  display: flex;
  align-items: center;
  padding-bottom: ${props => props.isIphoneX ? '24px' : '0'};
  padding-top: ${props => props.isIphoneX ? '12px' : '0'};
`;

const Inner = styled('div')`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
`;

const StyledCollapse = styled(Collapse)`
  width: 100%;

  &&& .ant-collapse-header {
    padding: 0;
    height: 12px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:active {
      background: #e8e8e8;
    }
  }

  & .ant-collapse-content > .ant-collapse-content-box {
    padding: 0;
  }

  &&& .ant-collapse-item {
    border-bottom: 0;
  }
`;

const PlayerButton = styled('button')`
  width: 24px;
  height: 100%;
  margin: 0 12px 0 0px;
  padding: 0;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  transition: all 10ms;

  &:first-of-type {
    margin-left: 24px;
  }

  &:last-of-type {
    margin-left: 12px;
  }

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

const Detail = (props: { style?: any }) => (
  <DetailContainer style={props.style || {}}>
    <Row>
      <Col xs={0} sm={24} md={24} lg={24} xl={24} xxl={24}>
        <MiniNotationDetail />
      </Col>
    </Row>
  </DetailContainer>
);

export const NotationShowControls = enhance(props => (
  <Outer>
    <Row1>
      <Inner>
        <Tooltip title="loop controls">
          <StyledCollapse
            bordered={false}
            onChange={props.handleLoopCollapseChange}
            activeKey={props.loopCollapsed ? [] : ['loop']}
          >
            <Panel showArrow={false} key="loop" header={null}> 
              <Inner>
                <PlayerButton style={{ opacity: 0 }} onClick={props.handleLoopCollapseChange}>
                  <ShowLoop />
                </PlayerButton>
                <PlayerButton style={{ opacity: 0 }}>
                  <PlayToggle />
                </PlayerButton>
                <SliderContainer>
                  <Loop />
                </SliderContainer>
                <PlayerButton style={{ opacity: 0 }}>
                  <MenuToggle
                    menuCollapsed={props.menuCollapsed}
                    onMenuClick={props.onMenuClick}
                  />
                </PlayerButton>
                <Detail style={{ opacity: 0 }} />
              </Inner>
            </Panel>
          </StyledCollapse>
        </Tooltip>
      </Inner>
    </Row1>
    <Row2 isIphoneX={props.isIphoneX}>
      <Inner>
        <PlayerButton onClick={props.handleLoopCollapseChange}>
          <ShowLoop />
        </PlayerButton>
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
        <Detail />
      </Inner>
    </Row2>
  </Outer>
));
