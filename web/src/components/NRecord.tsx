import { DownloadOutlined, UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Row, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useViewport } from '../ctx/viewport';
import { Layout, withLayout } from '../hocs/withLayout';
import { useConstantWindowSize } from '../hooks/useConstantWindowSize';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useMusicDisplayCursorTimeSync } from '../hooks/useMusicDisplayCursorTimeSync';
import { useMusicDisplayScrolling } from '../hooks/useMusicDisplayScrolling';
import { useNotation } from '../hooks/useNotation';
import { useQueryParams } from '../hooks/useQueryParams';
import { useRecorder } from '../hooks/useRecorder';
import { useStream } from '../hooks/useStream';
import { MediaPlayer, NoopMediaPlayer } from '../lib/MediaPlayer';
import { LoadingStatus, MusicDisplay } from '../lib/MusicDisplay';
import { NoopMusicDisplay } from '../lib/MusicDisplay/NoopMusicDisplay';
import { DisplayMode } from '../lib/musicxml';
import { FretMarkerDisplay } from '../lib/notations';
import { Duration } from '../util/Duration';
import { Errors } from './Errors';
import { Fretboard } from './Fretboard';
import { FullHeightDiv } from './FullHeightDiv';
import { Media } from './Media';
import { MusicSheet } from './MusicSheet';

enum RecordingStatus {
  None,
  Recording,
  Done,
}

const HEIGHT_OFFSET = 100;
const FLUID_CUTOFF = 900;
const POPUP_ERRORS = ['must open through exporter', 'must keep the exporter window opened'];
const PARAMS_ERRORS = ['missing width and/or height query params'];

const ErrorsOuter = styled.div`
  margin-top: 24px;
`;

const MediaOuter = styled.div<{ flex: boolean }>`
  ${(props) => (props.flex ? 'flex: 1;' : '')}
`;

const MusicSheetOuter = styled.div`
  flex: 1;
  min-height: 115px;
`;

const CallToActionLink = styled(Link)`
  margin-top: 24px;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Supplementals = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const StepDescription = styled.div`
  color: ${(props) => props.theme['@muted']};
`;

const NoCursor = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  cursor: none;
`;

const wait = (duration: Duration) => new Promise((resolve) => setTimeout(resolve, duration.ms));

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
  const [notation, errors, notationLoading] = useNotation(notationId);

  // general
  const filename = `${notationId}_${width}x${height}`;
  useDocumentTitle(`stringsync - ${filename}`);
  useConstantWindowSize(width, height + HEIGHT_OFFSET);

  // viewport
  const viewport = useViewport();
  const mediaFluid = viewport.innerWidth < FLUID_CUTOFF;
  const mediaFlex = !mediaFluid;

  // media player
  const [mediaPlayer, setMediaPlayer] = useState<MediaPlayer>(() => new NoopMediaPlayer());
  const [mediaPlayerReady, setMediaPlayerReady] = useState(() => mediaPlayer.isReady());
  useEffect(() => {
    setMediaPlayerReady(mediaPlayer.isReady());
    const eventBusIds = [
      mediaPlayer.eventBus.subscribe('init', () => {
        setMediaPlayerReady(true);
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...eventBusIds);
    };
  }, [mediaPlayer]);

  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay>(() => new NoopMusicDisplay());
  const [musicDisplayLoading, setMusicDisplayLoading] = useState(
    () => musicDisplay.getLoadingStatus() === LoadingStatus.Loading
  );
  useEffect(() => {
    setMusicDisplayLoading(musicDisplay.getLoadingStatus() === LoadingStatus.Loading);
    const eventBusIds = [
      musicDisplay.eventBus.subscribe('loadended', () => {
        setMusicDisplayLoading(false);
      }),
    ];
    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay]);

  // stream
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stream, streamPending, prompt, clearStream] = useStream();
  const [recorder, download] = useRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
  });
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>(RecordingStatus.None);

  // modal
  const [modalVisible, setModalVisible] = useState(false);
  const getStepIndex = (): 0 | 1 | 2 => {
    if (recordingStatus === RecordingStatus.None && !recorder) {
      return 0;
    }
    switch (recordingStatus) {
      case RecordingStatus.None:
      case RecordingStatus.Recording:
        return 1;
      case RecordingStatus.Done:
        return 2;
    }
  };
  const stepIndex = getStepIndex();
  const recording = recordingStatus === RecordingStatus.Recording;

  const onChooseClick = () => {
    prompt({
      audio: {
        echoCancellation: false,
        autoGainControl: false,
      },
      video: {
        width: { ideal: width },
        height: { ideal: height },
      },
    });
  };

  const onRecordClick = async () => {
    if (!recorder) {
      return;
    }

    setRecordingStatus(RecordingStatus.Recording);
    setModalVisible(false);

    mediaPlayer.seek(Duration.zero());

    await wait(Duration.sec(2));

    recorder.start();
    mediaPlayer.play();

    mediaPlayer.eventBus.once('end', async () => {
      mediaPlayer.seek(Duration.zero());
      await wait(Duration.ms(500));

      mediaPlayer.pause();
      recorder.stop();

      clearStream();
      setModalVisible(true);

      setRecordingStatus(RecordingStatus.Done);
    });
  };

  const onDownloadClick = () => {
    download(filename);
  };

  const onCloseClick = () => {
    window.close();
  };

  // render branches
  const renderPopupError = !window.opener;
  const renderParamsError = !width || !height;
  const renderNotationErrors = !renderPopupError && !renderParamsError && !notationLoading && errors.length > 0;
  const renderRecorder = !renderPopupError && !renderParamsError && !renderNotationErrors && !!notation;
  const renderModal = renderRecorder;
  const renderNoCursor = recording;

  return (
    <FullHeightDiv data-testid="n-record">
      {renderNoCursor && <NoCursor />}

      {renderModal && (
        <Modal
          title="record"
          visible={modalVisible}
          maskClosable={false}
          closable={false}
          footer={
            <Row justify="end">
              <Button onClick={onCloseClick}>close</Button>
            </Row>
          }
        >
          <Row>
            <Col span={8}>
              <Steps current={stepIndex} direction="vertical" size="small">
                <Steps.Step title="stream" />
                <Steps.Step title="record" />
                <Steps.Step title="download" />
              </Steps>
            </Col>
            <Col span={16}>
              {stepIndex === 0 && (
                <>
                  <StepDescription>choose the tab to stream from</StepDescription>

                  <br />

                  <Button block onClick={onChooseClick} icon={<UploadOutlined />}>
                    source
                  </Button>
                </>
              )}

              {stepIndex === 1 && (
                <>
                  <StepDescription>record the video</StepDescription>

                  <br />

                  <Button
                    block
                    type="primary"
                    disabled={!recorder || recording || !mediaPlayerReady || musicDisplayLoading}
                    loading={recording}
                    onClick={onRecordClick}
                    icon={<VideoCameraOutlined />}
                  >
                    record
                  </Button>
                </>
              )}

              {stepIndex === 2 && (
                <>
                  <StepDescription>{`${filename}.webm`}</StepDescription>

                  <br />

                  <Button block type="primary" onClick={onDownloadClick} icon={<DownloadOutlined />}>
                    download
                  </Button>
                </>
              )}
            </Col>
          </Row>
        </Modal>
      )}

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
            <MediaOuter flex={mediaFlex}>
              <Media
                video
                fluid={mediaFluid}
                src={notation.videoUrl}
                onPlayerChange={setMediaPlayer}
                style={{ height: '100%' }}
              />
            </MediaOuter>

            <Supplementals>
              <MusicSheetOuter>
                <MusicSheet
                  notation={notation}
                  displayMode={DisplayMode.TabsOnly}
                  onMusicDisplayChange={setMusicDisplay}
                />
              </MusicSheetOuter>

              <Fretboard
                mediaPlayer={mediaPlayer}
                musicDisplay={musicDisplay}
                fretMarkerDisplay={FretMarkerDisplay.Degree}
              />
            </Supplementals>
          </FlexColumn>
        </>
      )}
    </FullHeightDiv>
  );
});

export default NRecord;
