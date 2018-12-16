import * as React from 'react';
import { compose, withStateHandlers, withProps, lifecycle, withState } from 'recompose';
import { RouteComponentProps } from 'react-router';
import { Loading } from '../../../components/loading/Loading';
import { withNotation, IWithNotationProps } from '../../../enhancers/withNotation';
import { Video } from '../../../components/video';
import { pick, get } from 'lodash';
import { Row, Col, BackTop } from 'antd';
import styled from 'react-emotion';
import { Menu } from './menu';
import { Controls } from '../../../components/video/controls';
import { Score } from '../../../components/score/Score';
import { Carousel } from './carousel';
import { connect } from 'react-redux';
import { IStore } from '../../../@types/store';
import { INotation } from '../../../@types/notation';
import { NotationsActions } from '../../../data/notations/notationsActions';
import { fetchAllNotations } from '../../../data/notations/notationsApi';
import withSizes from 'react-sizes';

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
  notations: INotation[];
  fretboardVisible: boolean;
  setNotations: (notations: INotation[]) => void;
}

type LifecycleProps = StateProps & IRightDivProps & ILoadingProps & IWithNotationProps & IConnectProps;

interface IScoreWidthProps {
  scoreWidth: number;
}

type InnerProps = LifecycleProps & IScoreWidthProps;

const enhance = compose<InnerProps, RouteComponentProps> (
  withStateHandlers(
    { notationLoading: true },
    {
      notationLoaded: () => () => ({ notationLoading: false }),
      notationChanged: () =>  () => ({ notationLoading: true })
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
      notations: state.notations,
      fretboardVisible: state.notationMenu.fretboardVisible
    }),
    dispatch => ({
      setNotations: (notations: INotation[]) => dispatch(NotationsActions.setNotations(notations))
    })
  ),
  lifecycle<LifecycleProps, {}, {}>({
    async componentDidMount(): Promise<void> {
      // Only fetch if we need to
      if (this.props.notations.length > 0) {
        return;
      }

      const notations = await fetchAllNotations();
      // sorted in reverse
      const sorted = notations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      this.props.setNotations(sorted);
    }
  }),
  withSizes(({ width }) => ({ width })),
  withProps<IScoreWidthProps, LifecycleProps>(props => ({
    scoreWidth: Math.min(props.rightDiv ? props.rightDiv.offsetWidth : 1200, 1200)
  })),
);

const ControlsWrapper = styled('div')`
  width: 100%;
  background: white;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
`;

const VideoWrapper = styled('div')`
  min-height: 200px;
  margin: 0 auto;

  iframe {
    width: 100%;
    min-height: 200px;
  }
`;

export const NotationShow = enhance(props => {
  const videoProps = {
    ...pick(props.notation.video, 'kind', 'src'),
    onReady: props.videoLoaded
  };

  const scoreProps = {
    caret: true,
    scrollOffset: 0,
    deadTimeMs: props.notation.deadTimeMs,
    songName: props.notation.songName,
    artistName: props.notation.artistName,
    transcriberName: get(props.notation.transcriber, 'name', ''),
    vextabString: props.notation.vextabString,
    bpm: props.notation.bpm,
    width: props.scoreWidth
  };

  return (
    <div>
      <Loading loading={props.loading} />
      <BackTop style={{ bottom: '100px', right: '32px' }} />
      <Menu />
      <Row>
        <Col span={6}>
          <VideoWrapper>
            <Video {...videoProps} />
          </VideoWrapper>
        </Col>
        <Col span={18}>
          <div ref={props.handleRightDivRef} style={{ background: 'white' }}>
            <Row type="flex" justify="center">
              <Score {...scoreProps} />
            </Row>
          </div>
        </Col>
      </Row>
      <ControlsWrapper>
        <Controls />
      </ControlsWrapper>
    </div>
  );
});
