import * as React from 'react';
import { Lane } from '../../../components/lane/Lane';
import { compose } from 'recompose';
import { RouteComponentProps } from 'react-router';
import { withNotation, IWithNotationProps } from '../../../enhancers/withNotation';
import { Video } from '../../../components/video/Video';
import { get } from 'lodash';
import { Fretboard } from '../../../components/fretboard/Fretboard';
import { Score } from '../../../components/score/Score';
import styled from 'react-emotion';

type RouteProps = RouteComponentProps<{ id: string }>;

type InnerProps = RouteProps & IWithNotationProps;

const noop = () => null;

const enhance = compose<InnerProps, RouteProps>(
  withNotation<RouteProps>(
    props => parseInt(props.match.params.id, 10),
    noop,
    props => {
      const notationId = props.match.params.id;
      window.ss.message.error(`could not load notation '${notationId}'`);
      props.history.push('/');
    },
    noop
  )
);

const VideoWrapper = styled('div')`
  margin: 0 auto;

  iframe {
    width: 100%;
  }
`;

const Box = styled('div')`
  width: 860px;
  height: 860px;
  margin: 0 auto;
  border: 3px solid red;
`;

const ScoreWrapper = styled('div')`
  height: 289px;
  overflow: hidden;
`;

export const NotationStudio = enhance(props => (
  <Lane
    withTopMargin={true}
    withPadding={true}
  >
    <Box>
      <VideoWrapper>
        <Video
          kind={get(props.notation.video, 'kind', '')}
          src={get(props.notation.video, 'src', '')}
        />
      </VideoWrapper>
      <Fretboard numFrets={16} />
      <ScoreWrapper>
        <Score
          caret={true}
          scrollOffset={0}
          deadTimeMs={props.notation.deadTimeMs}
          songName={props.notation.songName}
          artistName={props.notation.artistName}
          transcriberName={get(props.notation.transcriber, 'name', '')}
          vextabString={props.notation.vextabString}
          bpm={props.notation.bpm}
          width={860}
          fretboardVisible={false}
        />
      </ScoreWrapper>
    </Box>
  </Lane>
));
