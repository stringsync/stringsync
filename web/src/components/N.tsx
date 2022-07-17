import { Button, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../ctx/auth';
import { useDevice } from '../ctx/device';
import { useViewport } from '../ctx/viewport';
import { Layout, withLayout } from '../hocs/withLayout';
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
import { compose } from '../util/compose';
import { Controls, CONTROLS_HEIGHT_PX } from './Controls';
import { Errors } from './Errors';
import { Fretboard } from './Fretboard';
import { FullHeightDiv } from './FullHeightDiv';
import { Media } from './Media';
import { MusicSheet } from './MusicSheet';
import { NotationInfo } from './NotationInfo';
import { NotationSink } from './NotationSink';
import { SplitPaneLayout, SplitPaneLayoutType } from './SplitPaneLayout';
import { SuggestedNotations } from './SuggestedNotations';

export const MIN_SIDECAR_WIDTH_PX = 400;
export const MAX_SIDECAR_WIDTH_FRAC = 0.6;
export const MAX_SIDECAR_WIDTH_PX = 1000;
export const MIN_THEATER_HEIGHT_PX = 100;
export const MAX_THEATER_HEIGHT_PX = 800;
export const MIN_NOTATION_HEIGHT_PX = 300;

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

const enhance = compose(withLayout(Layout.DEFAULT, { footer: false, lanes: false }));

export const N: React.FC = enhance(() => {
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
  const { innerHeight, innerWidth } = viewport;

  // controllers
  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay>(() => new NoopMusicDisplay());
  const [mediaPlayer, setMediaPlayer] = useState<MediaPlayer>(() => new NoopMediaPlayer());

  // settings
  const [notationSettings, setNotationSettings] = useNotationSettings();

  // slide end handlers
  const onVerticalSlideEnd = useCallback(
    (defaultSidecarWidthPx: number) => {
      setNotationSettings({ ...notationSettings, defaultSidecarWidthPx });
    },
    [notationSettings, setNotationSettings]
  );
  const onHorizontalSlideEnd = useCallback(
    (defaultTheaterHeightPx: number) => {
      setNotationSettings({ ...notationSettings, defaultTheaterHeightPx });
    },
    [notationSettings, setNotationSettings]
  );

  // layout
  const [layoutType, setLayoutType] = useState<SplitPaneLayoutType>('sidecar');
  const mediaFluid = layoutType === 'sidecar';
  const pane1ZIndex = layoutType === 'sidecar' ? 4 : undefined;
  const [fretboardDimensions, setFretboardDimensions] = useState({ width: 0, height: 0 });
  const apparentFretboardHeightPx = notationSettings.isFretboardVisible ? fretboardDimensions.height : 0;
  const [pane1MaxWidth, setPane1MaxWidth] = useState(MAX_SIDECAR_WIDTH_PX);
  useEffect(() => {
    const nextPane1MaxWidth = Math.min(MAX_SIDECAR_WIDTH_PX, MAX_SIDECAR_WIDTH_FRAC * innerWidth);
    setPane1MaxWidth(nextPane1MaxWidth);
  }, [innerWidth]);
  const [pane1MaxHeight, setPane1MaxHeight] = useState(MAX_THEATER_HEIGHT_PX);
  useEffect(() => {
    const nextPane1MaxHeight = Math.min(
      MAX_THEATER_HEIGHT_PX,
      innerHeight - MIN_NOTATION_HEIGHT_PX - CONTROLS_HEIGHT_PX - apparentFretboardHeightPx
    );
    setPane1MaxHeight(nextPane1MaxHeight);
  }, [notationSettings, innerHeight, apparentFretboardHeightPx]);

  // css effects
  useNoOverflow(hasErrors ? null : document.body);
  useNoUserSelect(document.body);
  useNoTouchAction(document.body);
  useNoTouchCallout(document.body);

  // render branches
  const showMobileLandscapeWarning = device.mobile && viewport.innerHeight < viewport.innerWidth;
  const showErrors = !loading && hasErrors;
  const showNotationPlayer = !loading && !hasErrors;
  const showEditButton = isTranscriber || isAdmin;
  const showVideoControls = layoutType === 'theater';
  const showVideo = layoutType === 'sidecar' || (showVideoControls && notationSettings.isVideoVisible);

  return (
    <Outer data-testid="n">
      {showMobileLandscapeWarning && <MobileLandscapeWarning />}

      {showErrors && (
        <ErrorsOuter>
          <Errors errors={errors} />

          <br />

          <Row justify="center">
            <SuggestedNotations srcNotationId={notationId} />
          </Row>
        </ErrorsOuter>
      )}

      {showNotationPlayer && (
        <>
          <NotationSink
            mediaPlayer={mediaPlayer}
            musicDisplay={musicDisplay}
            notationSettings={notationSettings}
            setNotationSettings={setNotationSettings}
          />

          <SplitPaneLayout
            handle={showVideo}
            pane1Content={<Media video={showVideo} src={videoUrl} fluid={mediaFluid} onPlayerChange={setMediaPlayer} />}
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
            pane1MinHeight={showVideo ? MIN_THEATER_HEIGHT_PX : 0}
            pane1MaxHeight={showVideo ? pane1MaxHeight : 0}
            pane1MinWidth={MIN_SIDECAR_WIDTH_PX}
            pane1MaxWidth={pane1MaxWidth}
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
                  <Fretboard
                    settings={notationSettings}
                    musicDisplay={musicDisplay}
                    mediaPlayer={mediaPlayer}
                    onResize={setFretboardDimensions}
                  />
                )}
                <ControlsOuter>
                  <Controls
                    videoControls={showVideoControls}
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
        </>
      )}
    </Outer>
  );
});

export default N;
