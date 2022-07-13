import { HomeOutlined, InfoCircleOutlined, SoundFilled, SoundOutlined } from '@ant-design/icons';
import { Alert, Button, Drawer, Row } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../ctx/auth';
import { useDevice } from '../ctx/device';
import { useViewport } from '../ctx/viewport';
import { useMute } from '../hooks/useMute';
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
import * as notations from '../lib/notations';
import { Fretboard } from './Fretboard';
import { FullHeightDiv } from './FullHeightDiv';
import { Media } from './Media';
import { MusicSheet } from './MusicSheet';
import { NotationInfo } from './NotationInfo';
import { Rect } from './Rect';
import { SlidingWindow } from './SlidingWindow';
import { SuggestedNotations } from './SuggestedNotations';

const DEFAULT_NOTATION_LAYOUT_OPTIONS: notations.NotationLayoutOptions = {
  target: 'sidecar',
  permitted: ['theater', 'sidecar'],
};

const MOBILE_NOTATION_LAYOUT_OPTIONS: notations.NotationLayoutOptions = {
  target: 'theater',
  permitted: ['theater'],
};

const Errors = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Sidecar = styled.div`
  background: white;
  height: 100%;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Flex1 = styled.div`
  overflow: hidden;
  flex: 1;
`;

const Flex1InvisibleScrollbar = styled(Flex1)`
  margin: 16px;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const FloatingButton = styled(Button)<{ $top: number }>`
  position: fixed;
  top: ${(props) => props.$top}px;
  right: -1px;
  z-index: 5;
`;

export const N: React.FC = () => {
  // notation
  const params = useParams();
  const notationId = params.id || '';
  const [notation, errors, loading] = useNotation(notationId);
  const hasErrors = errors.length > 0;
  const videoUrl = notation?.videoUrl || null;

  // refs
  const settingsContainerRef = useRef<HTMLDivElement>(null);
  const getSettingsContainer = () => settingsContainerRef.current || document.body;

  // settings
  const [notationSettings, setNotationSettings] = useNotationSettings();

  // music display
  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay>(() => new NoopMusicDisplay());

  // media player
  const [mediaPlayer, setMediaPlayer] = useState<MediaPlayer>(() => new NoopMediaPlayer());
  const [muted, toggleMute] = useMute(mediaPlayer);

  // sync sliding window sizes with settings
  const onSidecarSlideEnd = useCallback(
    (defaultSidecarWidthPx: number) => {
      setNotationSettings({ ...notationSettings, defaultSidecarWidthPx });
    },
    [notationSettings, setNotationSettings]
  );
  const onTheaterSlideEnd = useCallback(
    (defaultTheaterHeightPx: number) => {
      setNotationSettings({ ...notationSettings, defaultTheaterHeightPx });
    },
    [notationSettings, setNotationSettings]
  );

  // gadgets
  const [gadgetsHeightPx, setGadgetsHeightPx] = useState(0);
  const onGadgetsResize = useCallback((entries: ResizeObserverEntry[]) => {
    if (!entries.length) {
      return;
    }
    setGadgetsHeightPx(entries[0].contentRect.height);
  }, []);

  // layout
  const device = useDevice();
  const viewport = useViewport();
  const { xs, sm, md, innerWidth, innerHeight } = viewport;
  const ltLg = xs || sm || md;
  const layoutOptions = device.mobile || ltLg ? MOBILE_NOTATION_LAYOUT_OPTIONS : DEFAULT_NOTATION_LAYOUT_OPTIONS;
  const isMobileLandscape = device.mobile && innerHeight < innerWidth;
  const layoutSizeBoundsPx = notations.getLayoutSizeBoundsPx(viewport, gadgetsHeightPx);
  const isPreferredLayoutPermitted = layoutOptions.permitted.includes(notationSettings.preferredLayout);
  const layout = isPreferredLayoutPermitted ? notationSettings.preferredLayout : notations.getLayout(layoutOptions);

  // auth
  const [authState] = useAuth();
  const isAdmin = authState.user.role === UserRole.ADMIN;
  const isTranscriber = authState.user.id === notation?.transcriber.id;

  // sidecar drawer button
  const [isSidecarDrawerVisible, setSidecarDrawerVisibility] = useState(false);
  const onSidecarDrawerOpen = () => setSidecarDrawerVisibility(true);
  const onSidecarDrawerClose = () => setSidecarDrawerVisibility(false);

  // home button
  const navigate = useNavigate();
  const onHomeClick = () => navigate('/library');

  // css effects
  useNoOverflow(hasErrors ? null : document.body);
  useNoUserSelect(document.body);
  useNoTouchAction(document.body);
  useNoTouchCallout(document.body);

  // render branches
  const showErrors = !loading && hasErrors;
  const showEditButton = !authState.isPending && !device.mobile && (isAdmin || isTranscriber);
  const showMobileLandscapeWarning = isMobileLandscape;
  const showNotation = !loading && !hasErrors;
  const showSidecarLayout = showNotation && layout === 'sidecar';
  const showTheaterLayout = showNotation && layout === 'theater';

  return (
    <FullHeightDiv data-testid="n">
      <div ref={settingsContainerRef}>
        {showSidecarLayout && (
          <>
            <SlidingWindow
              split="vertical"
              defaultSize={notationSettings.defaultSidecarWidthPx}
              minSize={layoutSizeBoundsPx.sidecar.min}
              maxSize={layoutSizeBoundsPx.sidecar.max}
              onSlideEnd={onSidecarSlideEnd}
            >
              <Sidecar>
                <FlexColumn>
                  <Media video src={videoUrl} onPlayerChange={setMediaPlayer} />
                  <Flex1InvisibleScrollbar>
                    <br />
                    <NotationInfo notation={notation} />
                    <br />
                    <div>
                      {showEditButton && (
                        <Link to={`/n/${params.id}/edit`}>
                          <Button block type="default" size="large">
                            edit
                          </Button>
                        </Link>
                      )}
                      <SuggestedNotations srcNotationId={notationId} />
                    </div>
                  </Flex1InvisibleScrollbar>
                </FlexColumn>
              </Sidecar>

              <FlexColumn>
                <Flex1>
                  <MusicSheet
                    notation={notation}
                    displayMode={notationSettings.displayMode}
                    onMusicDisplayChange={setMusicDisplay}
                  />
                </Flex1>
                <Rect onResize={onGadgetsResize}>
                  {notationSettings.isFretboardVisible && (
                    <Fretboard settings={notationSettings} musicDisplay={musicDisplay} mediaPlayer={mediaPlayer} />
                  )}
                  <div>controls</div>
                </Rect>
              </FlexColumn>
            </SlidingWindow>
          </>
        )}

        {showTheaterLayout && (
          <>
            <FloatingButton $top={16} size="large" type="primary" icon={<HomeOutlined />} onClick={onHomeClick} />
            <FloatingButton
              $top={72}
              size="large"
              type="primary"
              icon={<InfoCircleOutlined />}
              onClick={onSidecarDrawerOpen}
            />
            <FloatingButton
              $top={128}
              size="large"
              type="primary"
              icon={muted ? <SoundOutlined /> : <SoundFilled />}
              onClick={toggleMute}
            />
            <Drawer
              closable
              mask={false}
              visible={isSidecarDrawerVisible}
              width="100%"
              onClose={onSidecarDrawerClose}
              getContainer={getSettingsContainer}
            >
              <Sidecar>
                <NotationInfo notation={notation} />
                <br />
                <div>
                  {showEditButton && (
                    <Link to={`/n/${params.id}/edit`}>
                      <Button block type="default" size="large">
                        edit
                      </Button>
                    </Link>
                  )}
                  <SuggestedNotations srcNotationId={notationId} />
                </div>
              </Sidecar>
            </Drawer>

            <SlidingWindow
              split="horizontal"
              defaultSize={notationSettings.defaultTheaterHeightPx}
              minSize={layoutSizeBoundsPx.theater.min}
              maxSize={layoutSizeBoundsPx.theater.max}
              onSlideEnd={onTheaterSlideEnd}
            >
              <Media
                video={notationSettings.isVideoVisible}
                fluid={false}
                src={videoUrl}
                onPlayerChange={setMediaPlayer}
              />
              <FlexColumn>
                <Flex1>
                  <MusicSheet
                    notation={notation}
                    displayMode={notationSettings.displayMode}
                    onMusicDisplayChange={setMusicDisplay}
                  />
                </Flex1>
                <Rect onResize={onGadgetsResize}>
                  {notationSettings.isFretboardVisible && (
                    <Fretboard settings={notationSettings} musicDisplay={musicDisplay} mediaPlayer={mediaPlayer} />
                  )}
                </Rect>
              </FlexColumn>
            </SlidingWindow>
          </>
        )}

        {showMobileLandscapeWarning && (
          <Overlay>
            <h2>
              Mobile landscape mode is not supported <em>yet</em>.
            </h2>
          </Overlay>
        )}

        {showErrors && (
          <Errors>
            <Row justify="center">
              <Alert
                showIcon
                type="error"
                message="error"
                description={
                  <>
                    {errors.map((error, ndx) => (
                      <div key={ndx}>{error}</div>
                    ))}
                  </>
                }
              />
            </Row>

            <br />

            <Row justify="center">
              <SuggestedNotations srcNotationId={notationId} />
            </Row>
          </Errors>
        )}
      </div>
    </FullHeightDiv>
  );
};

export default N;
