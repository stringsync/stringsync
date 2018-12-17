import * as React from 'react';
import $ from 'jquery';
import { compose, withStateHandlers, withProps, lifecycle } from 'recompose';
import { RouteComponentProps } from 'react-router';
import { Loading } from '../../../components/loading/Loading';
import { withNotation, IWithNotationProps } from '../../../enhancers/withNotation';
import { Video } from '../../../components/video';
import { pick, get } from 'lodash';
import { Row, Col } from 'antd';
import styled from 'react-emotion';
import { Menu } from './menu';
import { Controls } from '../../../components/video/controls';
import { Score } from '../../../components/score/Score';
import { connect } from 'react-redux';
import { IStore } from '../../../@types/store';
import withSizes from 'react-sizes';
import { noScroll } from '../../../enhancers/noScroll';
import { Suggestions } from './suggestions';
import { Fretboard } from '../../../components/fretboard';
import { Branch } from '../../../components/branch';
import { NotationMenuActions } from '../../../data/notation-menu/notationMenuActions';

type RouteProps = RouteComponentProps<{ id: string }>;

interface INotationLoadingProps {
  notationLoading: boolean;
  notationChanged: () => void;
  notationLoaded: () => void;
}

interface IVideoLoadingProps {
  videoLoading: boolean;
  videoLoaded: () => void;
  videoChanged: () => void;
}

interface IRightDivProps {
  rightDiv: HTMLDivElement | null;
  handleRightDivRef: (div: HTMLDivElement | null) => void;
}

type StateProps = INotationLoadingProps & IVideoLoadingProps & IRightDivProps;

interface ILoadingProps {
  loading: boolean;
}

interface IConnectStateProps {
  fretboardVisible: boolean;
}

interface IConnectDispatchProps {
  setFretboardVisibility: (fretboardVisible: boolean) => void;
}

interface IWithSizesProps {
  width: number;
  isDesktop: boolean;
  isTablet: boolean;
}

interface IScoreWidthProps {
  numFrets: number;
  scoreWidth: number;
}

type InnerProps = RouteProps & StateProps & IWithNotationProps & ILoadingProps &
  IConnectStateProps & IConnectDispatchProps & IWithSizesProps & IScoreWidthProps;

const LG_BREAKPOINT = 992; // px

const enhance = compose<InnerProps, RouteComponentProps>(
  noScroll<RouteComponentProps>(() => $('body')[0]),
  withStateHandlers(
    { notationLoading: true },
    {
      notationLoaded: () => () => ({ notationLoading: false }),
      notationChanged: () => () => ({ notationLoading: true })
    }
  ),
  withStateHandlers(
    { videoLoading: true },
    {
      videoLoaded: () => () => ({ videoLoading: false }),
      videoChanged: () => () => ({ videoLoading: true })
    },
  ),
  withStateHandlers(
    { rightDiv: null },
    { handleRightDivRef: () => (rightDiv: any) => ({ rightDiv }) },
  ),
  withProps<ILoadingProps, StateProps>(props => ({
    loading: props.notationLoading || props.videoLoading
  })),
  withNotation<StateProps & RouteProps>(
    props => parseInt(props.match.params.id, 10),
    props => props.notationLoaded(),
    props => props.history.push('/'),
    props => {
      props.notationChanged();
      props.videoChanged();
    }
  ),
  connect<IConnectStateProps, IConnectDispatchProps, {}, IStore>(
    state => ({
      fretboardVisible: state.notationMenu.fretboardVisible
    }),
    dispatch => ({
      setFretboardVisibility: (fretboardVisible: boolean) => {
        dispatch(NotationMenuActions.setFretboardVisibility(fretboardVisible));
      }
    })
  ),
  withSizes(size => ({
    width: size.width,
    isDesktop: withSizes.isDesktop(size),
    isTablet: withSizes.isTablet(size)
  })),
  withProps<IScoreWidthProps, any>(props => ({
    numFrets: props.isDesktop ? 21 : props.isTablet ? 19 : 14,
    scoreWidth: Math.min(props.rightDiv ? props.rightDiv.offsetWidth : 1200, 1200) - 20
  })),
  lifecycle<InnerProps, {}, {}>({
    componentDidMount(): void {
      if (!this.props.isDesktop) {
        this.props.setFretboardVisibility(false);
      }
    }
  })
);

const getVideoProps = (props: InnerProps) => ({
  ...pick(props.notation.video, 'kind', 'src'),
  onReady: props.videoLoaded
});

const getScoreProps = (props: InnerProps) => ({
  caret: true,
  // 100 offset + 200 for video + 64 for controls + 200 for fretboard
  scrollOffset: 100 + (props.width <= LG_BREAKPOINT ? 264 : 0) + (props.fretboardVisible ? 200 : 0),
  deadTimeMs: props.notation.deadTimeMs,
  songName: props.notation.songName,
  artistName: props.notation.artistName,
  transcriberName: get(props.notation.transcriber, 'name', ''),
  vextabString: props.notation.vextabString,
  bpm: props.notation.bpm,
  width: props.scoreWidth
});

const LeftCol = styled('div')`
  background: white;
  border-right: 1px solid #e8e8e8;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: ${LG_BREAKPOINT}px) {
    height: auto;
  }
`;

interface IScoreWrapperProps {
  fretboardVisible: boolean;
}

const fretboardHeight = (props: IScoreWrapperProps) => props.fretboardVisible ? 200 : 0;
const ScoreWrapper = styled('div') <IScoreWrapperProps>`
  /* the nav bar is 64px and the player bar is 64 px */
  height: calc(100vh - 128px - ${fretboardHeight}px);
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  -webkit-overflow-scrolling: touch;

  @media (max-width: ${LG_BREAKPOINT}px) {
    height: calc(100vh - 128px - 200px - ${fretboardHeight}px);
  }
`;

const VideoWrapper = styled('div')`
  min-height: 200px;
  margin: 0 auto;
  overflow: hidden;

  iframe {
    width: 100%;
    min-height: 200px;
  }

  @media (max-width: ${LG_BREAKPOINT}px) {
    height: 200px;

    iframe {
      height: 200px;
    }
  }
`;

export const NotationShow = enhance(props => (
  <div>
    <Loading loading={props.loading} />
    <Menu />
    <Row>
      <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
        <LeftCol>
          <VideoWrapper>
            <Video {...getVideoProps(props)} />
          </VideoWrapper>
          <Branch visible={props.fretboardVisible && props.width < LG_BREAKPOINT}>
            <Fretboard numFrets={props.numFrets} />
          </Branch>
          <Branch visible={props.width < LG_BREAKPOINT}>
            <Controls />
          </Branch>
          <Branch visible={props.width >= LG_BREAKPOINT}>
            <Suggestions />
          </Branch>
        </LeftCol>
      </Col>
      <Col xs={24} sm={24} md={24} lg={18} xl={18} xxl={18}>
        <div
          ref={props.handleRightDivRef}
          style={{ background: 'white' }}
        >
          <ScoreWrapper
            id="score-wrapper"
            fretboardVisible={props.fretboardVisible}
          >
            <Row type="flex" justify="center">
              <Score {...getScoreProps(props)} />
            </Row>
          </ScoreWrapper>
          <Branch visible={props.fretboardVisible && props.width >= LG_BREAKPOINT}>
            <Fretboard numFrets={props.numFrets} />
          </Branch>
          <Branch visible={props.width >= LG_BREAKPOINT}>
            <Controls />
          </Branch>
        </div>
      </Col>
    </Row>
  </div>
));
