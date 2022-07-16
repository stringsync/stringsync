import { Alert, Button, Row } from 'antd';
import React, { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../ctx/auth';
import { useDevice } from '../ctx/device';
import { useViewport } from '../ctx/viewport';
import { useNoOverflow } from '../hooks/useNoOverflow';
import { useNotation } from '../hooks/useNotation';
import { useNotationSettings } from '../hooks/useNotationSettings';
import { useNoTouchAction } from '../hooks/useNoTouchAction';
import { useNoTouchCallout } from '../hooks/useNoTouchCallout';
import { useNoUserSelect } from '../hooks/useNoUserSelect';
import { UserRole } from '../lib/graphql';
import { MediaPlayer, NoopMediaPlayer } from '../lib/MediaPlayer';
import { MusicDisplay } from '../lib/MusicDisplay';
import { NoopMusicDisplay } from '../lib/MusicDisplay/NoopMusicDisplay';
import { Controls } from './Controls';
import { Fretboard } from './Fretboard';
import { FullHeightDiv } from './FullHeightDiv';
import { Media } from './Media';
import { MusicSheet } from './MusicSheet';
import { NotationInfo } from './NotationInfo';
import { SplitPaneLayout, SplitPaneLayoutType } from './SplitPaneLayout';
import { SuggestedNotations } from './SuggestedNotations';

const Outer = styled(FullHeightDiv)`
  background: white;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const ErrorsOuter = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
`;

const Flex1 = styled.div`
  overflow: hidden;
  flex: 1;
  height: 100%;
`;

const Flex1InvisibleScrollbar = styled(Flex1)`
  margin: 16px;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const ControlsOuter = styled.div`
  z-index: 4;
`;

const MobileLandscapeWarning = () => {
  return (
    <Overlay>
      <h2>
        Mobile landscape mode is not supported <em>yet</em>.
      </h2>
    </Overlay>
  );
};

const Errors: React.FC<{ errors: string[]; notationId: string }> = (props) => {
  return (
    <ErrorsOuter>
      <Row justify="center">
        <Alert
          showIcon
          type="error"
          message="error"
          description={
            <>
              {props.errors.map((error, ndx) => (
                <div key={ndx}>{error}</div>
              ))}
            </>
          }
        />
      </Row>

      <br />

      <Row justify="center">
        <SuggestedNotations srcNotationId={props.notationId} />
      </Row>
    </ErrorsOuter>
  );
};

export const N: React.FC = () => {
  // notation
  const params = useParams();
  const notationId = params.id || '';
  const [notation, errors, loading] = useNotation(notationId);
  const hasErrors = errors.length > 0;
  const videoUrl = notation?.videoUrl || null;

  // auth
  const [authState] = useAuth();
  const isAdmin = authState.user.role === UserRole.ADMIN;
  const isTranscriber = authState.user.id === notation?.transcriber.id;

  // dimensions
  const device = useDevice();
  const viewport = useViewport();

  // controllers
  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay>(() => new NoopMusicDisplay());
  const [mediaPlayer, setMediaPlayer] = useState<MediaPlayer>(() => new NoopMediaPlayer());

  // settings
  const [notationSettings, setNotationSettings] = useNotationSettings();

  // slide end handlers
  const onHorizontalSlideEnd = useCallback(
    (defaultSidecarWidthPx: number) => {
      setNotationSettings({ ...notationSettings, defaultSidecarWidthPx });
    },
    [notationSettings, setNotationSettings]
  );
  const onVerticalSlideEnd = useCallback(
    (defaultTheaterHeightPx: number) => {
      setNotationSettings({ ...notationSettings, defaultTheaterHeightPx });
    },
    [notationSettings, setNotationSettings]
  );

  // layout type
  const [layoutType, setLayoutType] = useState<SplitPaneLayoutType>('sidecar');
  const mediaFluid = layoutType === 'sidecar';
  const pane1ZIndex = layoutType === 'sidecar' ? 4 : undefined;

  // css effects
  useNoOverflow(hasErrors ? null : document.body);
  useNoUserSelect(document.body);
  useNoTouchAction(document.body);
  useNoTouchCallout(document.body);

  // render branches
  const showMobileLandscapeWarning = device.mobile && viewport.innerHeight < viewport.innerWidth;
  const showErrors = !loading && hasErrors;
  const showSplitPaneLayout = !loading && !hasErrors;
  const showEditButton = isTranscriber || isAdmin;

  return (
    <Outer data-testid="n">
      {showMobileLandscapeWarning && <MobileLandscapeWarning />}

      {showErrors && <Errors errors={errors} notationId={notationId} />}

      {showSplitPaneLayout && (
        <SplitPaneLayout
          pane1Content={<Media video src={videoUrl} fluid={mediaFluid} onPlayerChange={setMediaPlayer} />}
          pane1Supplements={
            <Flex1InvisibleScrollbar>
              <br />
              <NotationInfo notation={notation} />
              <br />
              <div>
                {showEditButton && (
                  <Link to={`/n/${notationId}/edit`}>
                    <Button block type="default" size="large">
                      edit
                    </Button>
                  </Link>
                )}
                <SuggestedNotations srcNotationId={notationId} />
              </div>
            </Flex1InvisibleScrollbar>
          }
          pane1DefaultHeight={notationSettings.defaultTheaterHeightPx}
          pane1DefaultWidth={notationSettings.defaultSidecarWidthPx}
          pane1Style={{ zIndex: pane1ZIndex, background: 'white' }}
          pane2Content={
            <Flex1>
              <MusicSheet
                notation={notation}
                displayMode={notationSettings.displayMode}
                onMusicDisplayChange={setMusicDisplay}
              />
            </Flex1>
          }
          pane2Supplements={
            <>
              {notationSettings.isFretboardVisible && (
                <Fretboard settings={notationSettings} musicDisplay={musicDisplay} mediaPlayer={mediaPlayer} />
              )}
              <ControlsOuter>
                <Controls
                  videoControls={false}
                  notation={notation}
                  musicDisplay={musicDisplay}
                  mediaPlayer={mediaPlayer}
                  settings={notationSettings}
                  setSettings={setNotationSettings}
                />
              </ControlsOuter>
            </>
          }
          onHorizontalSlideEnd={onHorizontalSlideEnd}
          onVerticalSlideEnd={onVerticalSlideEnd}
          preferredLayoutType={notationSettings.preferredLayout}
          onLayoutTypeChange={setLayoutType}
        />
      )}
    </Outer>
  );
};

export default N;
