import * as React from 'react';
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
import { Fretboard } from '../../../components/fretboard';
import { Score } from '../../../components/score/Score';
import withSizes from 'react-sizes';

type RouteProps = RouteComponentProps<{ id: string }>;

interface IStateProps {
  notationLoading: boolean;
  videoLoading: boolean;
  notationLoaded: () => void;
  videoLoaded: () => void;
}

interface ILoadingProps {
  loading: boolean;
}

interface IWithSizesProps {
  scoreWidth: number;
}

type InnerProps = RouteProps & IStateProps & ILoadingProps & IWithSizesProps & IWithNotationProps;

const enhance = compose<InnerProps, RouteComponentProps> (
  withStateHandlers(
    { notationLoading: true },
    { notationLoaded: () => () => ({ notationLoading: false }) }
  ),
  withStateHandlers(
    { videoLoading: true },
    { videoLoaded: () => () => ({ videoLoading: false }) }
  ),
  withProps<ILoadingProps, IStateProps>(props => ({
    loading: props.notationLoading || props.videoLoading
  })),
  withNotation<IStateProps & RouteProps>(
    props => parseInt(props.match.params.id, 10),
    props => props.notationLoaded(),
    props => props.history.push('/')
  ),
  withSizes(size => ({ scoreWidth: Math.min(1200, size.width) }))
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

  return (
    <div>
      <Loading loading={props.loading} />
      <Menu />
      <Row
        type="flex"
        justify="center"
        align="bottom"
        gutter={2}
        style={{ background: 'white', borderBottom: '1px solid #e8e8e8' }}
      >
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <VideoWrapper>
            <Video {...videoProps} />
          </VideoWrapper>
        </Col>
        <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
          <Fretboard />
        </Col>
      </Row>
      <Row type="flex" justify="center">
        <Col span={24}>
          <Row type="flex" justify="center" style={{ background: 'white' }}>
            <Score
              songName={props.notation.songName}
              artistName={props.notation.artistName}
              transcriberName={get(props.notation.transcriber, 'name', '')}
              vextabString={props.notation.vextabString}
              width={props.scoreWidth}
            />
          </Row>
        </Col>
      </Row>
      <ControlsWrapper>
        <Controls />
      </ControlsWrapper>
    </div>
  );
});
