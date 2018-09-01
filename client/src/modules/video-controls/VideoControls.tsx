import * as React from 'react';
import styled from 'react-emotion';
import { Loop } from './Loop';
import { MenuToggle } from './MenuToggle';
import { MiniDetail } from './MiniDetail';
import { PlayToggle } from './PlayToggle';
import { Collapse, Tooltip } from 'antd';
import { Scrubber } from './Scrubber';
import { ShowLoop } from './ShowLoop';
import { compose, withHandlers, withProps, withState, lifecycle } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { UiActions } from 'data';
import { scroller } from 'react-scroll';
import { ScreenScroller } from './ScreenScroller';

const { Panel } = Collapse;

interface IConnectProps {
  isVideoActive: boolean;
  videoPlayer: Video.IVideo | null;
  isNotationMenuVisible: boolean;
  setNotationMenuVisibility: (notationMenuVisibility: boolean) => void;
  focusScrollElement: (focusedScrollElement: string | null) => void;
}

interface IStateProps extends IConnectProps {
  loopCollapsed: boolean;
  tooltipVisible: boolean;
  setTooltipVisibility: (tooltipVisible: boolean) => void;
  setLoopCollapsed: (loopCollapsed: boolean) => void;
}

interface IHandlerProps extends IStateProps {
  handleLoopCollapseChange: () => void;
  handleNotationMenuClick: () => void;
  handleScreenScrollerClick: () => void;
  toggleScrollState: () => void;
}

interface IIPhoneXProps extends IHandlerProps {
  isIphoneX: boolean;
}

const enhance = compose<IIPhoneXProps, {}>(
  connect(
    (state: Store.IState) => ({
      focusedScrollElement: state.ui.focusedScrollElement,
      isNotationMenuVisible: state.ui.isNotationMenuVisible,
      isVideoActive: state.video.isActive,
      videoPlayer: state.video.player,
    }),
    (dispatch: Dispatch) => ({
      focusScrollElement: (focusedScrollElement: string | null) => dispatch(UiActions.focusScrollElement(focusedScrollElement)),
      setNotationMenuVisibility: (visibility: boolean) => dispatch(UiActions.setNotationMenuVisibility(visibility)),
    })
  ),
  withState('tooltipVisible', 'setTooltipVisibility', true),
  withState('loopCollapsed', 'setLoopCollapsed', true),
  withHandlers({
    handleLoopCollapseChange: (props: any) => () => {
      props.setLoopCollapsed(!props.loopCollapsed);
    },
    handleNotationMenuClick: (props: any) => () => {
      props.setNotationMenuVisibility(!props.isNotationMenuVisible)
    },
    toggleScrollState: (props: any) => () => {
      let nextFocusedElement: string;
      if (props.focusedScrollElement === 'app-top') {
        nextFocusedElement = 'notation-show-score';
      } else {
        nextFocusedElement = 'app-top';
      }

      if (props.tooltipVisible) {
        props.setTooltipVisibility(false);
      }

      scroller.scrollTo(nextFocusedElement, { smooth: true, duration: 300 });
      props.focusScrollElement(nextFocusedElement);
    }
  }),
  withProps(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const ratio = window.devicePixelRatio || 1;
    const screen = {
      height: window.screen.height * ratio,
      width: window.screen.width * ratio,
    };

    const isIphoneX = iOS && screen.width === 1125 && screen.height === 2436;

    return { isIphoneX }
  }),
  lifecycle<IIPhoneXProps, {}>({
    componentDidMount() {
      setTimeout(() => this.props.setTooltipVisibility(false), 8000);
    }
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

const Row2 = styled('div') <IRow2DivProps>`
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
  margin: 0 8px;
  padding: 0;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  transition: all 10ms;

  &:focus {
    outline: 0;
  }

  i {
    font-size: 24px;
  }
`;

const SliderContainer = styled('div')`
  width: 100%;
  margin: 0 8px;
`;

export const VideoControls = enhance(props => (
  <Outer>
    <Row1>
      <Inner>
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
              <PlayerButton style={{ opacity: 0 }} onClick={props.toggleScrollState}>
                <ScreenScroller />
              </PlayerButton>
              <PlayerButton style={{ opacity: 0 }} onClick={props.handleNotationMenuClick}>
                <MenuToggle />
              </PlayerButton>
              <MiniDetail hidden={true} />
            </Inner>
          </Panel>
        </StyledCollapse>
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
        <PlayerButton onClick={props.toggleScrollState}>
          <Tooltip title="toggle view" visible={props.tooltipVisible}>
            <ScreenScroller />
          </Tooltip>
        </PlayerButton>
        <PlayerButton onClick={props.handleNotationMenuClick}>
          <MenuToggle />
        </PlayerButton>
        <MiniDetail />
      </Inner>
    </Row2>
  </Outer>
));
