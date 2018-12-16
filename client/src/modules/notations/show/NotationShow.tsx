import * as React from 'react';
import $ from 'jquery';
import { compose, withStateHandlers, withProps } from 'recompose';
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

interface IConnectProps {
  fretboardVisible: boolean;
}

interface IWithSizesProps {
  width: number;
}

interface IScoreWidthProps {
  scoreWidth: number;
}

type InnerProps = RouteProps & StateProps & IWithNotationProps & ILoadingProps &
  IConnectProps & IWithSizesProps & IScoreWidthProps;

const LG_BREAKPOINT = 992;

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
  connect(
    (state: IStore) => ({
      fretboardVisible: state.notationMenu.fretboardVisible
    })
  ),
  withSizes(({ width }) => ({ width })),
  withProps<IScoreWidthProps, any>(props => ({
    scoreWidth: Math.min(props.rightDiv ? props.rightDiv.offsetWidth : 1200, 1200) - 20
  })),
);

const getVideoProps = (props: InnerProps) => ({
  ...pick(props.notation.video, 'kind', 'src'),
  onReady: props.videoLoaded
});

const getScoreProps = (props: InnerProps) => ({
  caret: true,
  scrollOffset: 128 + (props.width <= LG_BREAKPOINT ? 200 : 0),
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

  @media (max-width: ${LG_BREAKPOINT}px) {
    height: auto;
  }
`;

const ScoreWrapper = styled('div')`
  /* the nav bar is 64px and the player bar is 64 px */
  height: calc(100vh - 128px);
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  -webkit-overflow-scrolling: touch;

  @media (max-width: ${LG_BREAKPOINT}px) {
    height: calc(100vh - 128px - 200px);
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
          <Suggestions visible={props.width >= LG_BREAKPOINT} />
        </LeftCol>
      </Col>
      <Col xs={24} sm={24} md={24} lg={18} xl={18} xxl={18}>
        <div
          ref={props.handleRightDivRef}
          style={{ background: 'white' }}
        >
          <ScoreWrapper id="score-wrapper">
            <Row type="flex" justify="center">
              <Score {...getScoreProps(props)} />
            </Row>
          </ScoreWrapper>
          <Row>
            <Controls />
          </Row>
        </div>
      </Col>
    </Row>
  </div>
));
