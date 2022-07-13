import { HomeOutlined, InfoCircleOutlined, SoundFilled, SoundOutlined } from '@ant-design/icons';
import { Alert, Button, Drawer, Row } from 'antd';
import React, { RefObject, useCallback, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../ctx/auth';
import { useDevice } from '../ctx/device';
import { useViewport } from '../ctx/viewport';
import { useMute } from '../hooks/useMute';
import { useNoOverflow } from '../hooks/useNoOverflow';
import { Notation, useNotation } from '../hooks/useNotation';
import { NotationSettings, useNotationSettings } from '../hooks/useNotationSettings';
import { useNoTouchAction } from '../hooks/useNoTouchAction';
import { useNoTouchCallout } from '../hooks/useNoTouchCallout';
import { useNoUserSelect } from '../hooks/useNoUserSelect';
import { UserRole } from '../lib/graphql';
import { MediaPlayer, NoopMediaPlayer } from '../lib/MediaPlayer';
import { MusicDisplay } from '../lib/MusicDisplay';
import { NoopMusicDisplay } from '../lib/MusicDisplay/NoopMusicDisplay';
import * as notations from '../lib/notations';
import { Controls } from './Controls';
import { Fretboard } from './Fretboard';
import { FullHeightDiv } from './FullHeightDiv';
import { Media } from './Media';
import { MusicSheet } from './MusicSheet';
import { NotationInfo } from './NotationInfo';
import { ResizeObserver } from './ResizeObserver';
import { SlidingWindow } from './SlidingWindow';
import { SuggestedNotations } from './SuggestedNotations';

const NOTATION_DETAIL_THRESHOLD_PX = 767;

const DEFAULT_NOTATION_LAYOUT_OPTIONS: notations.NotationLayoutOptions = {
  target: 'sidecar',
  permitted: ['theater', 'sidecar'],
};

const MOBILE_NOTATION_LAYOUT_OPTIONS: notations.NotationLayoutOptions = {
  target: 'theater',
  permitted: ['theater'],
};

const ErrorsOuter = styled.div`
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
  height: 100%;
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
  z-index: 4;
`;

const FloatingGhostButton = styled(FloatingButton)`
  opacity: 0.2;

  :focus,
  :hover {
    opacity: 1;
  }
`;

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

  // general
  const settingsContainerRef = useRef<HTMLDivElement>(null);
  const getSettingsContainer = () => settingsContainerRef.current || document.body;
  const [notationSettings, setNotationSettings] = useNotationSettings();
  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay>(() => new NoopMusicDisplay());
  const [mediaPlayer, setMediaPlayer] = useState<MediaPlayer>(() => new NoopMediaPlayer());

  // sliding window
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

  // gadgets (the things below the music sheet)
  const [fretboardRect, setFretboardRect] = useState(() => new DOMRect(0, 0, 0, 0));
  const [controlsRect, setControlsRect] = useState(() => new DOMRect(0, 0, 0, 0));
  const fretboardHeightPx = notationSettings.isFretboardVisible ? fretboardRect.height : 0;
  const fretboardWidthPx = notationSettings.isFretboardVisible ? fretboardRect.width : 0;
  const gadgetsHeightPx = fretboardHeightPx + controlsRect.height;
  const gadgetsWidthPx = fretboardWidthPx + controlsRect.width;
  const onFretboardResize = useCallback((entries: ResizeObserverEntry[]) => {
    setFretboardRect(entries[0].contentRect);
  }, []);
  const onControlsResize = useCallback((entries: ResizeObserverEntry[]) => {
    setControlsRect(entries[0].contentRect);
  }, []);
  const showNotationDetailOnControls = gadgetsWidthPx >= NOTATION_DETAIL_THRESHOLD_PX;

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
  const showTheaterLayout = showNotation && layout === 'theater' && notationSettings.isVideoVisible;
  const showNoVideoLayout = showNotation && layout === 'theater' && !notationSettings.isVideoVisible;

  return (
    <FullHeightDiv data-testid="n" ref={settingsContainerRef}>
      {showMobileLandscapeWarning && <MobileLandscapeWarning />}

      {showErrors && <Errors errors={errors} notationId={notationId} />}

      {showSidecarLayout && (
        <SidecarLayout
          getSettingsContainer={getSettingsContainer}
          layoutSizeBoundsPx={layoutSizeBoundsPx}
          mediaPlayer={mediaPlayer}
          musicDisplay={musicDisplay}
          notation={notation}
          notationId={notationId}
          notationSettings={notationSettings}
          onFretboardResize={onFretboardResize}
          onControlsResize={onControlsResize}
          onMusicDisplayChange={setMusicDisplay}
          onPlayerChange={setMediaPlayer}
          onSlideEnd={onSidecarSlideEnd}
          setNotationSettings={setNotationSettings}
          settingsContainerRef={settingsContainerRef}
          showNotationDetailOnControls={showNotationDetailOnControls}
          showEditButton={showEditButton}
          videoUrl={videoUrl}
        />
      )}

      {showTheaterLayout && (
        <TheaterLayout
          getSettingsContainer={getSettingsContainer}
          layoutSizeBoundsPx={layoutSizeBoundsPx}
          mediaPlayer={mediaPlayer}
          musicDisplay={musicDisplay}
          notation={notation}
          notationId={notationId}
          notationSettings={notationSettings}
          onFretboardResize={onFretboardResize}
          onControlsResize={onControlsResize}
          onMusicDisplayChange={setMusicDisplay}
          onPlayerChange={setMediaPlayer}
          onSlideEnd={onTheaterSlideEnd}
          setNotationSettings={setNotationSettings}
          settingsContainerRef={settingsContainerRef}
          showNotationDetailOnControls={showNotationDetailOnControls}
          showEditButton={showEditButton}
          videoUrl={videoUrl}
        />
      )}

      {showNoVideoLayout && (
        <NoVideoLayout
          getSettingsContainer={getSettingsContainer}
          layoutSizeBoundsPx={layoutSizeBoundsPx}
          mediaPlayer={mediaPlayer}
          musicDisplay={musicDisplay}
          notation={notation}
          notationId={notationId}
          notationSettings={notationSettings}
          onFretboardResize={onFretboardResize}
          onControlsResize={onControlsResize}
          onMusicDisplayChange={setMusicDisplay}
          onPlayerChange={setMediaPlayer}
          onSlideEnd={onTheaterSlideEnd}
          setNotationSettings={setNotationSettings}
          settingsContainerRef={settingsContainerRef}
          showNotationDetailOnControls={showNotationDetailOnControls}
          showEditButton={showEditButton}
          videoUrl={videoUrl}
        />
      )}
    </FullHeightDiv>
  );
};

type LayoutProps = {
  getSettingsContainer: () => HTMLElement;
  layoutSizeBoundsPx: ReturnType<typeof notations.getLayoutSizeBoundsPx>;
  mediaPlayer: MediaPlayer;
  musicDisplay: MusicDisplay;
  notation: Notation;
  notationId: string;
  notationSettings: NotationSettings;
  onControlsResize: (entries: ResizeObserverEntry[]) => void;
  onFretboardResize: (entries: ResizeObserverEntry[]) => void;
  onMusicDisplayChange: (musicDisplay: MusicDisplay) => void;
  onPlayerChange: (mediaPlayer: MediaPlayer) => void;
  onSlideEnd: (size: number) => void;
  setNotationSettings: (notationSettings: NotationSettings) => void;
  settingsContainerRef: RefObject<HTMLDivElement>;
  showNotationDetailOnControls: boolean;
  showEditButton: boolean;
  videoUrl: string | null;
};

const SidecarLayout: React.FC<LayoutProps> = (props) => {
  return (
    <SlidingWindow
      split="vertical"
      defaultSize={props.notationSettings.defaultSidecarWidthPx}
      minSize={props.layoutSizeBoundsPx.sidecar.min}
      maxSize={props.layoutSizeBoundsPx.sidecar.max}
      onSlideEnd={props.onSlideEnd}
      pane1Style={{ zIndex: 4 }}
      dividerZIndexOffset={1}
    >
      <Sidecar>
        <FlexColumn>
          <Media video src={props.videoUrl} onPlayerChange={props.onPlayerChange} />
          <Flex1InvisibleScrollbar>
            <br />
            <NotationInfo notation={props.notation} />
            <br />
            <div>
              {props.showEditButton && (
                <Link to={`/n/${props.notationId}/edit`}>
                  <Button block type="default" size="large">
                    edit
                  </Button>
                </Link>
              )}
              <SuggestedNotations srcNotationId={props.notationId} />
            </div>
          </Flex1InvisibleScrollbar>
        </FlexColumn>
      </Sidecar>

      <FlexColumn>
        <Flex1>
          <MusicSheet
            notation={props.notation}
            displayMode={props.notationSettings.displayMode}
            onMusicDisplayChange={props.onMusicDisplayChange}
          />
        </Flex1>
        {props.notationSettings.isFretboardVisible && (
          <ResizeObserver onResize={props.onFretboardResize}>
            <Fretboard
              settings={props.notationSettings}
              musicDisplay={props.musicDisplay}
              mediaPlayer={props.mediaPlayer}
            />
          </ResizeObserver>
        )}
        <ResizeObserver onResize={props.onControlsResize} style={{ zIndex: 4 }}>
          <Controls
            showDetail={props.showNotationDetailOnControls}
            videoControls={false}
            settingsContainerRef={props.settingsContainerRef}
            notation={props.notation}
            musicDisplay={props.musicDisplay}
            mediaPlayer={props.mediaPlayer}
            settings={props.notationSettings}
            setSettings={props.setNotationSettings}
          />
        </ResizeObserver>
      </FlexColumn>
    </SlidingWindow>
  );
};

const TheaterLayout: React.FC<LayoutProps> = (props) => {
  const navigate = useNavigate();
  const onHomeClick = () => navigate('/library');

  const [isSidecarDrawerVisible, setSidecarDrawerVisibility] = useState(false);
  const onSidecarDrawerOpen = () => setSidecarDrawerVisibility(true);
  const onSidecarDrawerClose = () => setSidecarDrawerVisibility(false);

  const [muted, toggleMute] = useMute(props.mediaPlayer);

  return (
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
        getContainer={props.getSettingsContainer}
      >
        <Sidecar>
          <NotationInfo notation={props.notation} />
          <br />
          <div>
            {props.showEditButton && (
              <Link to={`/n/${props.notationId}/edit`}>
                <Button block type="default" size="large">
                  edit
                </Button>
              </Link>
            )}
            <SuggestedNotations srcNotationId={props.notationId} />
          </div>
        </Sidecar>
      </Drawer>

      <SlidingWindow
        split="horizontal"
        defaultSize={props.notationSettings.defaultTheaterHeightPx}
        minSize={props.layoutSizeBoundsPx.theater.min}
        maxSize={props.layoutSizeBoundsPx.theater.max}
        onSlideEnd={props.onSlideEnd}
        dividerZIndexOffset={1}
      >
        <Media
          video={props.notationSettings.isVideoVisible}
          fluid={false}
          src={props.videoUrl}
          onPlayerChange={props.onPlayerChange}
        />
        <FlexColumn>
          <Flex1>
            <MusicSheet
              notation={props.notation}
              displayMode={props.notationSettings.displayMode}
              onMusicDisplayChange={props.onMusicDisplayChange}
            />
          </Flex1>
          {props.notationSettings.isFretboardVisible && (
            <ResizeObserver onResize={props.onFretboardResize}>
              <Fretboard
                settings={props.notationSettings}
                musicDisplay={props.musicDisplay}
                mediaPlayer={props.mediaPlayer}
              />
            </ResizeObserver>
          )}
          <ResizeObserver onResize={props.onControlsResize} style={{ zIndex: 4 }}>
            <Controls
              showDetail={props.showNotationDetailOnControls}
              videoControls
              settingsContainerRef={props.settingsContainerRef}
              notation={props.notation}
              musicDisplay={props.musicDisplay}
              mediaPlayer={props.mediaPlayer}
              settings={props.notationSettings}
              setSettings={props.setNotationSettings}
            />
          </ResizeObserver>
        </FlexColumn>
      </SlidingWindow>
    </>
  );
};

const NoVideoLayout: React.FC<LayoutProps> = (props) => {
  const navigate = useNavigate();
  const onHomeClick = () => navigate('/library');

  const [isSidecarDrawerVisible, setSidecarDrawerVisibility] = useState(false);
  const onSidecarDrawerOpen = () => setSidecarDrawerVisibility(true);
  const onSidecarDrawerClose = () => setSidecarDrawerVisibility(false);

  const [muted, toggleMute] = useMute(props.mediaPlayer);

  return (
    <>
      <FloatingGhostButton $top={16} size="large" type="primary" icon={<HomeOutlined />} onClick={onHomeClick} />
      <FloatingGhostButton
        $top={72}
        size="large"
        type="primary"
        icon={<InfoCircleOutlined />}
        onClick={onSidecarDrawerOpen}
      />
      <FloatingGhostButton
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
        getContainer={props.getSettingsContainer}
      >
        <Sidecar>
          <NotationInfo notation={props.notation} />
          <br />
          <div>
            {props.showEditButton && (
              <Link to={`/n/${props.notationId}/edit`}>
                <Button block type="default" size="large">
                  edit
                </Button>
              </Link>
            )}
            <SuggestedNotations srcNotationId={props.notationId} />
          </div>
        </Sidecar>
      </Drawer>

      <Media video={false} fluid={false} src={props.videoUrl} onPlayerChange={props.onPlayerChange} />

      <FlexColumn>
        <Flex1>
          <MusicSheet
            notation={props.notation}
            displayMode={props.notationSettings.displayMode}
            onMusicDisplayChange={props.onMusicDisplayChange}
          />
        </Flex1>
        {props.notationSettings.isFretboardVisible && (
          <ResizeObserver onResize={props.onFretboardResize}>
            <Fretboard
              settings={props.notationSettings}
              musicDisplay={props.musicDisplay}
              mediaPlayer={props.mediaPlayer}
            />
          </ResizeObserver>
        )}
        <ResizeObserver onResize={props.onControlsResize} style={{ zIndex: 4 }}>
          <Controls
            showDetail={props.showNotationDetailOnControls}
            videoControls
            settingsContainerRef={props.settingsContainerRef}
            notation={props.notation}
            musicDisplay={props.musicDisplay}
            mediaPlayer={props.mediaPlayer}
            settings={props.notationSettings}
            setSettings={props.setNotationSettings}
          />
        </ResizeObserver>
      </FlexColumn>
    </>
  );
};

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

export default N;
