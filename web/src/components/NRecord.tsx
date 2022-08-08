import { DownloadOutlined, UploadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Row, Steps } from 'antd';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
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

type StepDeclaration = {
  title: string;
  content: ReactNode;
};

enum RecordingStatus {
  None,
  Recording,
  Done,
}

const POPUP_ERRORS = ['must open through exporter', 'must keep the exporter window opened'];
const PARAMS_ERRORS = ['missing width and/or height query params'];

const ErrorsOuter = styled.div`
  margin-top: 24px;
`;

const MediaOuter = styled.div`
  flex: 1;
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
  useConstantWindowSize(width, height);

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
  const [stream, streamPending, prompt, clearStream] = useStream();
  const [recorder, download] = useRecorder(stream);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>(RecordingStatus.None);

  // modal
  const [modalVisible, setModalVisible] = useState(true);
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
  const steps = useMemo<StepDeclaration[]>(() => {
    const recording = recordingStatus === RecordingStatus.Recording;

    const onChooseClick = () => {
      prompt({
        audio: true,
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

      await wait(Duration.sec(2));

      mediaPlayer.seek(Duration.zero());

      recorder.start();
      mediaPlayer.play();

      mediaPlayer.eventBus.once('end', async () => {
        mediaPlayer.seek(Duration.zero());
        await wait(Duration.ms(500));
        mediaPlayer.pause();
        recorder.stop();
        setRecordingStatus(RecordingStatus.Done);
        clearStream();
        setModalVisible(true);
      });
    };

    const onDownloadClick = () => {
      download(filename);
    };

    return [
      {
        title: 'stream',
        content: (
          <>
            <StepDescription>choose the tab to stream from</StepDescription>

            <br />

            <Button block onClick={onChooseClick} icon={<UploadOutlined />}>
              source
            </Button>
          </>
        ),
      },
      {
        title: 'record',
        content: (
          <>
            <StepDescription>record the video</StepDescription>

            <br />

            <Button
              block
              type="primary"
              disabled={!recorder || recording}
              loading={recording}
              onClick={onRecordClick}
              icon={<VideoCameraOutlined />}
            >
              record
            </Button>
          </>
        ),
      },
      {
        title: 'download',
        content: (
          <>
            <StepDescription>{`${filename}.webm`}</StepDescription>

            <br />

            <Button block type="primary" onClick={onDownloadClick} icon={<DownloadOutlined />}>
              download
            </Button>
          </>
        ),
      },
    ];
  }, [recordingStatus, recorder, filename, prompt, width, height, mediaPlayer, clearStream, download]);

  // render branches
  const renderPopupError = !window.opener;
  const renderParamsError = !width || !height;
  const renderNotationErrors = !renderPopupError && !renderParamsError && !notationLoading && errors.length > 0;
  const renderRecorder = !renderPopupError && !renderParamsError && !renderNotationErrors && !!notation;
  const renderModal = renderRecorder;

  return (
    <FullHeightDiv data-testid="n-record">
      {renderModal && (
        <Modal title="record" visible={modalVisible} maskClosable={false} closable={false} footer={null}>
          <Row>
            <Col span={8}>
              <Steps current={stepIndex} direction="vertical" size="small">
                {steps.map((step) => (
                  <Steps.Step key={step.title} title={step.title} />
                ))}
              </Steps>
            </Col>
            <Col span={16}>{steps[stepIndex].content}</Col>
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
            <MediaOuter>
              <Media
                video
                fluid={false}
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
