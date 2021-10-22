import { DoubleRightOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import { noop } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { useDevice } from '../../ctx/device';
import { useViewport } from '../../ctx/viewport/useViewport';
import { useMemoCmp } from '../../hooks/useMemoCmp';
import { MusicDisplay as MusicDisplayBackend } from '../../lib/MusicDisplay';
import { Nullable } from '../../util/types';
import { Fretboard } from '../Fretboard';
import { Controls, CONTROLS_HEIGHT_PX } from './Controls/Controls';
import * as helpers from './helpers';
import { Media } from './Media';
import { MusicDisplay } from './MusicDisplay';
import { Sidecar } from './Sidecar';
import { SplitPane } from './SplitPane';
import { Tags } from './Tags';
import { NotationLayoutOptions, NotationSettings, RenderableNotation } from './types';

const NOTATION_DETAIL_THRESHOLD_PX = 767;

const Outer = styled.div<{ $height: number }>`
  height: ${(props) => props.$height}px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 0;
`;

const Subtitle = styled.h2`
  text-align: center;
  margin-bottom: 0;
`;

const Muted = styled.h3`
  text-align: center;
  color: ${(props) => props.theme['@muted']};
`;

const FloatingButton = styled(Button)<{ $top: number }>`
  position: fixed;
  top: ${(props) => props.$top}px;
  right: -1px;
  z-index: 3;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  transition: height 200ms;
  height: 100%;
`;

const Flex1 = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
`;

const Flex1InvisibleScrollbar = styled(Flex1)`
  margin: 16px;

  ::-webkit-scrollbar {
    display: none;
  }
`;

type Props = {
  loading?: boolean;
  sidecar?: React.ReactNode;
  layoutOptions?: NotationLayoutOptions;
  notation: Nullable<RenderableNotation>;
  defaultSettings?: Partial<NotationSettings>;
  onSettingsChange?: (settings: NotationSettings) => void;
};

export const Notation: React.FC<Props> = (props) => {
  // props
  const loading = props.loading || false;
  const notation = props.notation;
  const layoutOptions = props.layoutOptions;
  const sidecar = props.sidecar;
  const src = notation?.videoUrl || null;
  const defaultSettings = useMemoCmp(props.defaultSettings);
  const onSettingsChange = props.onSettingsChange || noop;

  // refs
  const settingsContainerRef = useRef<HTMLDivElement>(null);
  const getContainer = () => settingsContainerRef.current || document.body;

  // notation
  const songName = notation?.songName || '???';
  const artistName = notation?.artistName || '???';
  const transcriberUsername = notation?.transcriber.username || '???';

  // settings
  const device = useDevice();
  const [settings, setSettings] = useState<NotationSettings>(() => ({
    ...helpers.getDefaultSettings(device),
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
  const layout = isPreferredLayoutPermitted ? settings.preferredLayout : helpers.getLayout(layoutOptions);

  // split pane sizing
  const viewport = useViewport();
  const [pane1Dimensions, setPane1Dimensions] = useState({ width: 0, height: 0 });
  const [fretboardDimensions, setFretboardDimensions] = useState({ width: 0, height: 0 });
  const apparentFretboardHeightPx = settings.isFretboardVisible ? fretboardDimensions.height : 0;
  const offsetHeightPx = CONTROLS_HEIGHT_PX + apparentFretboardHeightPx;
  const layoutSizeBoundsPx = helpers.getLayoutSizeBoundsPx(viewport, offsetHeightPx);
  const pane2WidthPx = viewport.innerWidth - pane1Dimensions.width;

  // sidecar drawer button
  const [isSidecarDrawerVisible, setSidecarDrawerVisibility] = useState(false);
  const onOpenSidecarDrawerButtonClick = () => setSidecarDrawerVisibility(true);
  const onSidecarDrawerCloseClick = () => setSidecarDrawerVisibility(false);

  // home button
  const history = useHistory();
  const onHomeClick = () => history.push('/library');

  // music display
  const [musicDisplay, setMusicDisplay] = useState<MusicDisplayBackend | null>(null);
  const [lastResizeWidthPx, setLastResizeWidthPx] = useState(pane2WidthPx);
  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    if (pane2WidthPx === 0) {
      // if there's no width, don't bother resizing
      return;
    }
    if (lastResizeWidthPx === pane2WidthPx) {
      return;
    }
    setLastResizeWidthPx(pane2WidthPx);
    musicDisplay.resize();
  }, [lastResizeWidthPx, musicDisplay, pane2WidthPx]);

  // controls detail
  const showDetail = pane2WidthPx > NOTATION_DETAIL_THRESHOLD_PX;

  return (
    <Outer data-testid="notation" ref={settingsContainerRef} $height={viewport.innerHeight}>
      {layout === 'sidecar' && (
        <>
          <SplitPane
            handle
            split="vertical"
            defaultSize={settings.defaultSidecarWidthPx}
            minSize={layoutSizeBoundsPx.sidecar.min}
            maxSize={layoutSizeBoundsPx.sidecar.max}
            onPane1Resize={setPane1Dimensions}
            pane1Style={{ zIndex: 4, height: '100%' }}
            onDragFinished={updateDefaultSidecarWidthPx}
          >
            <Sidecar videoSkeleton loading={loading}>
              <FlexColumn>
                <Media video loading={loading} src={src} />

                <Flex1InvisibleScrollbar>
                  <br />

                  <Title>{songName}</Title>
                  <Subtitle>by {artistName}</Subtitle>
                  <Muted>{transcriberUsername}</Muted>
                  <Tags tags={notation?.tags || []} />

                  <br />

                  {sidecar}
                </Flex1InvisibleScrollbar>
              </FlexColumn>
            </Sidecar>
            <FlexColumn>
              <Flex1>
                <MusicDisplay loading={loading} notation={notation} onMusicDisplayChange={setMusicDisplay} />
              </Flex1>
              {settings.isFretboardVisible && <Fretboard onResize={setFretboardDimensions} />}
              <Controls
                videoControls={false}
                settingsContainerRef={settingsContainerRef}
                showDetail={showDetail}
                notation={notation}
                musicDisplay={musicDisplay}
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
            icon={<DoubleRightOutlined />}
            onClick={onOpenSidecarDrawerButtonClick}
          />
          <Drawer
            closable
            visible={isSidecarDrawerVisible}
            width="100%"
            onClose={onSidecarDrawerCloseClick}
            getContainer={getContainer}
          >
            <Sidecar loading={loading}>
              <Title>{songName}</Title>
              <Subtitle>by {artistName}</Subtitle>
              <Muted>{transcriberUsername}</Muted>
              <Tags tags={notation?.tags || []} />

              <br />

              {sidecar}
            </Sidecar>
          </Drawer>

          <SplitPane
            handle={settings.isVideoVisible}
            split="horizontal"
            style={{ position: 'static' }}
            pane1Style={settings.isVideoVisible ? undefined : { display: 'none' }}
            defaultSize={settings.defaultTheaterHeightPx}
            minSize={layoutSizeBoundsPx.theater.min}
            maxSize={layoutSizeBoundsPx.theater.max}
            onPane1Resize={setPane1Dimensions}
            onDragFinished={settings.isVideoVisible ? updateDefaultTheaterHeightPx : noop}
          >
            <Media video={settings.isVideoVisible} fluid={false} loading={loading} src={src} />
            <FlexColumn>
              <Flex1>
                <MusicDisplay loading={loading} notation={notation} onMusicDisplayChange={setMusicDisplay} />
              </Flex1>
              {settings.isFretboardVisible && <Fretboard onResize={setFretboardDimensions} />}
              <Controls
                videoControls
                settingsContainerRef={settingsContainerRef}
                showDetail={showDetail}
                notation={notation}
                musicDisplay={musicDisplay}
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
