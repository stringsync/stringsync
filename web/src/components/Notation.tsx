import { HomeOutlined, InfoCircleOutlined, SoundFilled, SoundOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import { noop } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDevice } from '../ctx/device';
import { useViewport } from '../ctx/viewport/useViewport';
import { useMemoCmp } from '../hooks/useMemoCmp';
import { useMusicDisplayResize } from '../hooks/useMusicDisplayResize';
import { MediaPlayer, NoopMediaPlayer } from '../lib/MediaPlayer';
import { LoadingStatus, MusicDisplay } from '../lib/MusicDisplay';
import { NoopMusicDisplay } from '../lib/MusicDisplay/NoopMusicDisplay';
import * as notations from '../lib/notations';
import { Nullable } from '../util/types';
import { Controls, CONTROLS_HEIGHT_PX } from './Controls';
import { Fretboard } from './Fretboard';
import { Info } from './Info';
import { Media } from './Media';
import { MusicSheet } from './MusicSheet';
import { NotationSink } from './NotationSink';
import { SplitPane } from './SplitPane';

const NOTATION_DETAIL_THRESHOLD_PX = 767;

const Outer = styled.div`
  height: 100%;
`;

const Sidecar = styled.div`
  background: white;
  height: 100%;
`;

const FloatingButton = styled(Button)<{ $top: number }>`
  position: fixed;
  top: ${(props) => props.$top}px;
  right: -1px;
  z-index: 5;
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

type Props = {
  skeleton?: boolean;
  sidecar?: React.ReactNode;
  layoutOptions?: notations.NotationLayoutOptions;
  notation: Nullable<notations.RenderableNotation>;
  defaultSettings?: Partial<notations.NotationSettings>;
  maxHeight?: number | string;
  onSettingsChange?: (settings: notations.NotationSettings) => void;
  onInit?: () => void;
};

export const Notation: React.FC<Props> = (props) => {
  // props
  const notation = props.notation;
  const layoutOptions = props.layoutOptions;
  const sidecar = props.sidecar;
  const src = notation?.videoUrl || null;
  const maxHeight = props.maxHeight;
  const defaultSettings = useMemoCmp(props.defaultSettings);
  const onSettingsChange = props.onSettingsChange || noop;

  // refs
  const settingsContainerRef = useRef<HTMLDivElement>(null);
  const getContainer = () => settingsContainerRef.current || document.body;

  // settings
  const device = useDevice();
  const [settings, setSettings] = useState<notations.NotationSettings>(() => ({
    ...notations.getDefaultSettings(device),
    ...defaultSettings,
  }));
  useEffect(() => {
    onSettingsChange(settings);
  }, [onSettingsChange, settings]);
  const updateDefaultSidecarWidthPx = useCallback(
    (defaultSidecarWidthPx: number) => {
      setSettings({ ...settings, defaultSidecarWidthPx });
    },
    [settings, setSettings]
  );
  const updateDefaultTheaterHeightPx = useCallback(
    (defaultTheaterHeightPx: number) => {
      setSettings({ ...settings, defaultTheaterHeightPx });
    },
    [settings, setSettings]
  );

  // layout
  const isPreferredLayoutPermitted = layoutOptions?.permitted.includes(settings.preferredLayout) || false;
  const layout = isPreferredLayoutPermitted ? settings.preferredLayout : notations.getLayout(layoutOptions);

  // split pane sizing
  const viewport = useViewport();
  const [pane1Dimensions, setPane1Dimensions] = useState({ width: 0, height: 0 });
  const [fretboardDimensions, setFretboardDimensions] = useState({ width: 0, height: 0 });
  const apparentFretboardHeightPx = settings.isFretboardVisible ? fretboardDimensions.height : 0;
  const offsetHeightPx = CONTROLS_HEIGHT_PX + apparentFretboardHeightPx;
  const layoutSizeBoundsPx = notations.getLayoutSizeBoundsPx(viewport, offsetHeightPx);
  const pane2WidthPx = viewport.innerWidth - pane1Dimensions.width;

  // sidecar drawer button
  const [isSidecarDrawerVisible, setSidecarDrawerVisibility] = useState(false);
  const onSidecarDrawerOpen = () => setSidecarDrawerVisibility(true);
  const onSidecarDrawerClose = () => setSidecarDrawerVisibility(false);

  // home button
  const navigate = useNavigate();
  const onHomeClick = () => navigate('/library');

  // music display
  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay>(() => new NoopMusicDisplay());
  useMusicDisplayResize(musicDisplay, pane2WidthPx);

  // media player
  const [mediaPlayer, setMediaPlayer] = useState<MediaPlayer>(() => new NoopMediaPlayer());
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    const eventBusIds = [
      mediaPlayer.eventBus.subscribe('mutechange', (payload) => {
        setMuted(payload.muted);
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...eventBusIds);
    };
  }, [mediaPlayer]);
  const onMuteClick = () => {
    if (muted) {
      mediaPlayer.unmute();
    } else {
      mediaPlayer.mute();
    }
  };

  // initialization tracking
  const [mediaPlayerInitialized, setMediaPlayerInitialized] = useState(false);
  useEffect(() => {
    if (device.mobile) {
      setMediaPlayerInitialized(true);
      return;
    }
    const eventBusIds = [
      mediaPlayer.eventBus.once('init', () => {
        setMediaPlayerInitialized(true);
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...eventBusIds);
      setMediaPlayerInitialized(false);
    };
  }, [device.mobile, mediaPlayer]);

  const [musicDisplayInitialized, setMusicDisplayInitialized] = useState(false);
  useEffect(() => {
    if (musicDisplay.getLoadingStatus() === LoadingStatus.Done) {
      setMusicDisplayInitialized(true);
      return;
    }
    const eventBusIds = [
      musicDisplay.eventBus.once('loadended', () => {
        setMusicDisplayInitialized(true);
      }),
    ];
    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
      setMusicDisplayInitialized(false);
    };
  }, [musicDisplay]);
  const onInit = props.onInit;
  useEffect(() => {
    if (onInit && mediaPlayerInitialized && musicDisplayInitialized) {
      onInit();
    }
  }, [onInit, mediaPlayerInitialized, musicDisplayInitialized]);

  // conditionally show nodes
  const skeleton = props.skeleton ?? false;
  const showDetail = pane2WidthPx > NOTATION_DETAIL_THRESHOLD_PX;

  return (
    <Outer data-testid="notation" ref={settingsContainerRef}>
      <NotationSink
        settings={settings}
        setSettings={setSettings}
        musicDisplay={musicDisplay}
        mediaPlayer={mediaPlayer}
      />

      {layout === 'sidecar' && (
        <>
          <SplitPane
            handle
            split="vertical"
            style={{ maxHeight }}
            defaultSize={settings.defaultSidecarWidthPx}
            minSize={layoutSizeBoundsPx.sidecar.min}
            maxSize={layoutSizeBoundsPx.sidecar.max}
            onPane1Resize={setPane1Dimensions}
            pane1Style={{ zIndex: 5, height: '100%' }}
            onDragFinished={updateDefaultSidecarWidthPx}
          >
            <Sidecar>
              <FlexColumn>
                <Media video skeleton={skeleton} src={src} onPlayerChange={setMediaPlayer} />

                <Flex1InvisibleScrollbar>
                  <br />
                  <Info skeleton={skeleton} notation={notation} />
                  <br />
                  {sidecar}
                </Flex1InvisibleScrollbar>
              </FlexColumn>
            </Sidecar>
            <FlexColumn>
              <Flex1>
                <MusicSheet
                  skeleton={skeleton}
                  notation={notation}
                  onMusicDisplayChange={setMusicDisplay}
                  displayMode={settings.displayMode}
                />
              </Flex1>
              {settings.isFretboardVisible && (
                <Fretboard
                  settings={settings}
                  musicDisplay={musicDisplay}
                  mediaPlayer={mediaPlayer}
                  onResize={setFretboardDimensions}
                />
              )}
              <Controls
                videoControls={false}
                settingsContainerRef={settingsContainerRef}
                showDetail={showDetail}
                notation={notation}
                musicDisplay={musicDisplay}
                mediaPlayer={mediaPlayer}
                settings={settings}
                setSettings={setSettings}
              />
            </FlexColumn>
          </SplitPane>
        </>
      )}

      {layout === 'theater' && (
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
            onClick={onMuteClick}
          />
          <Drawer
            closable
            mask={false}
            visible={isSidecarDrawerVisible}
            width="100%"
            onClose={onSidecarDrawerClose}
            getContainer={getContainer}
          >
            <Sidecar>
              <Info skeleton={skeleton} notation={notation} />
              <br />
              {sidecar}
            </Sidecar>
          </Drawer>

          <SplitPane
            handle={settings.isVideoVisible}
            split="horizontal"
            style={{ position: 'static', maxHeight }}
            pane1Style={settings.isVideoVisible ? undefined : { display: 'none' }}
            defaultSize={settings.defaultTheaterHeightPx}
            minSize={layoutSizeBoundsPx.theater.min}
            maxSize={layoutSizeBoundsPx.theater.max}
            onPane1Resize={setPane1Dimensions}
            onDragFinished={settings.isVideoVisible ? updateDefaultTheaterHeightPx : noop}
          >
            <Media
              video={settings.isVideoVisible}
              fluid={false}
              skeleton={skeleton}
              src={src}
              onPlayerChange={setMediaPlayer}
            />
            <FlexColumn>
              <Flex1>
                <MusicSheet
                  skeleton={skeleton}
                  notation={notation}
                  onMusicDisplayChange={setMusicDisplay}
                  displayMode={settings.displayMode}
                />
              </Flex1>
              {settings.isFretboardVisible && (
                <Fretboard
                  settings={settings}
                  musicDisplay={musicDisplay}
                  mediaPlayer={mediaPlayer}
                  onResize={setFretboardDimensions}
                />
              )}
              <Controls
                videoControls
                settingsContainerRef={settingsContainerRef}
                showDetail={showDetail}
                notation={notation}
                musicDisplay={musicDisplay}
                mediaPlayer={mediaPlayer}
                settings={settings}
                setSettings={setSettings}
              />
            </FlexColumn>
          </SplitPane>
        </>
      )}
    </Outer>
  );
};
