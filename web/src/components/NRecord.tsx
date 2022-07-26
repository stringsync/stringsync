import { Row } from 'antd';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, withLayout } from '../hocs/withLayout';
import { useConstantWindowSize } from '../hooks/useConstantWindowSize';
import { useMusicDisplayCursorTimeSync } from '../hooks/useMusicDisplayCursorTimeSync';
import { useMusicDisplayScrolling } from '../hooks/useMusicDisplayScrolling';
import { useNotation } from '../hooks/useNotation';
import { useQueryParams } from '../hooks/useQueryParams';
import { MediaPlayer, NoopMediaPlayer } from '../lib/MediaPlayer';
import { MusicDisplay } from '../lib/MusicDisplay';
import { NoopMusicDisplay } from '../lib/MusicDisplay/NoopMusicDisplay';
import { DisplayMode } from '../lib/musicxml';
import { FretMarkerDisplay } from '../lib/notations';
import { Errors } from './Errors';
import { Fretboard } from './Fretboard';
import { FullHeightDiv } from './FullHeightDiv';
import { Media } from './Media';
import { MusicSheet } from './MusicSheet';

const POPUP_ERRORS = ['must open through exporter'];
const PARAMS_ERRORS = ['missing width and/or height query params'];

const ErrorsOuter = styled.div`
  margin-top: 24px;
`;

const CallToActionLink = styled(Link)`
  margin-top: 24px;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Flex1 = styled.div`
  overflow: hidden;
  flex: 1;
  height: 100%;
`;

const Sink: React.FC<{ musicDisplay: MusicDisplay; mediaPlayer: MediaPlayer }> = (props) => {
  const musicDisplay = props.musicDisplay;
  const mediaPlayer = props.mediaPlayer;

  useMusicDisplayScrolling(true, musicDisplay, mediaPlayer);
  useMusicDisplayCursorTimeSync(musicDisplay, mediaPlayer);

  return null;
};

const enhance = withLayout(Layout.NONE, { footer: false, lanes: false });

export const NRecord: React.FC = enhance(() => {
  // params
  const params = useParams();
  const queryParams = useQueryParams();
  const notationId = params.id || '';
  const width = parseInt(queryParams.get('width') ?? '0', 10);
  const height = parseInt(queryParams.get('height') ?? '0', 10);
  const [notation, errors, loading] = useNotation(notationId);

  // window
  useConstantWindowSize(width, height);

  // fretboard
  const [mediaPlayer, setMediaPlayer] = useState<MediaPlayer>(() => new NoopMediaPlayer());
  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay>(() => new NoopMusicDisplay());

  // render branches
  const renderPopupError = !window.opener;
  const renderParamsError = !width || !height;
  const renderNotationErrors = !renderPopupError && !renderParamsError && !loading && errors.length > 0;
  const renderRecorder = !renderPopupError && !renderParamsError && !renderNotationErrors && !!notation;

  return (
    <FullHeightDiv data-testid="n-record">
      {renderParamsError && (
        <ErrorsOuter>
          <Errors errors={PARAMS_ERRORS} />

          <Row justify="center">
            <CallToActionLink to="/library">library</CallToActionLink>
          </Row>
        </ErrorsOuter>
      )}

      {renderPopupError && (
        <ErrorsOuter>
          <Errors errors={POPUP_ERRORS} />

          <Row justify="center">
            <CallToActionLink to={`/n/${notationId}/export`}>exporter</CallToActionLink>
          </Row>
        </ErrorsOuter>
      )}

      {renderNotationErrors && (
        <ErrorsOuter>
          <Errors errors={errors} />

          <Row justify="center">
            <CallToActionLink to="/library">library</CallToActionLink>
          </Row>
        </ErrorsOuter>
      )}

      {renderRecorder && (
        <>
          <Sink musicDisplay={musicDisplay} mediaPlayer={mediaPlayer} />

          <FlexColumn>
            <Media video src={notation.videoUrl} onPlayerChange={setMediaPlayer} />
            <Flex1>
              <MusicSheet
                notation={notation}
                displayMode={DisplayMode.TabsOnly}
                onMusicDisplayChange={setMusicDisplay}
              />
            </Flex1>
            <Fretboard
              mediaPlayer={mediaPlayer}
              musicDisplay={musicDisplay}
              fretMarkerDisplay={FretMarkerDisplay.Degree}
            />
          </FlexColumn>
        </>
      )}
    </FullHeightDiv>
  );
});

export default NRecord;
