import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useViewport } from '../ctx/viewport';
import { NotationSettings, SetNotationSettings } from '../hooks/useNotationSettings';
import { MediaPlayer, NoopMediaPlayer } from '../lib/MediaPlayer';
import { MusicDisplay } from '../lib/MusicDisplay';
import { NoopMusicDisplay } from '../lib/MusicDisplay/NoopMusicDisplay';
import * as notations from '../lib/notations';
import { Nullable } from '../util/types';
import { Controls, CONTROLS_HEIGHT_PX } from './Controls';
import { Fretboard } from './Fretboard';
import { FullHeightDiv } from './FullHeightDiv';
import { Media } from './Media';
import { MusicSheet } from './MusicSheet';
import { NotationSink } from './NotationSink';
import { SplitPaneLayout, SplitPaneLayoutType } from './SplitPaneLayout';

const MIN_SIDECAR_WIDTH_PX = 400;
const MAX_SIDECAR_WIDTH_FRAC = 0.6;
const MAX_SIDECAR_WIDTH_PX = 1000;
const MIN_THEATER_HEIGHT_PX = 100;
const MAX_THEATER_HEIGHT_PX = 800;
const MIN_NOTATION_HEIGHT_PX = 300;

const Outer = styled(FullHeightDiv)`
  background: white;
`;

const Flex1 = styled.div`
  overflow: hidden;
  flex: 1;
  height: 100%;
`;

const ControlsOuter = styled.div`
  z-index: 4;
`;

type Props = {
  notation: Nullable<notations.RenderableNotation>;
  sidecar?: React.ReactNode;
  notationSettings: NotationSettings;
  setNotationSettings: SetNotationSettings;
  onLayoutTypeChange?: (layoutType: SplitPaneLayoutType) => void;
  onMediaPlayerChange?: (mediaPLayer: MediaPlayer) => void;
};

export const NotationPlayer: React.FC<Props> = (props) => {
  const notation = props.notation;
  const notationSettings = props.notationSettings;
  const setNotationSettings = props.setNotationSettings;
  const sidecar = props.sidecar;
  const onLayoutTypeChange = props.onLayoutTypeChange;
  const onMediaPlayerChange = props.onMediaPlayerChange;

  // refs
  const settingsContainerRef = useRef<HTMLDivElement>(null);

  // dimensions
  const viewport = useViewport();
  const { innerHeight, innerWidth } = viewport;

  // controllers
  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay>(() => new NoopMusicDisplay());
  const [mediaPlayer, setMediaPlayer] = useState<MediaPlayer>(() => new NoopMediaPlayer());
  useEffect(() => {
    if (onMediaPlayerChange) {
      onMediaPlayerChange(mediaPlayer);
    }
  }, [onMediaPlayerChange, mediaPlayer]);

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
  useEffect(() => {
    if (onLayoutTypeChange) {
      onLayoutTypeChange(layoutType);
    }
  }, [onLayoutTypeChange, layoutType]);
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
      Math.max(
        MIN_THEATER_HEIGHT_PX,
        innerHeight - MIN_NOTATION_HEIGHT_PX - CONTROLS_HEIGHT_PX - apparentFretboardHeightPx
      )
    );
    setPane1MaxHeight(nextPane1MaxHeight);
  }, [notationSettings, innerHeight, apparentFretboardHeightPx]);

  // render branches
  const renderVideoControls = layoutType === 'theater';
  const renderVideo = layoutType === 'sidecar' || (renderVideoControls && notationSettings.isVideoVisible);

  return (
    <Outer data-testid="notation-player" ref={settingsContainerRef}>
      {notation && (
        <>
          <NotationSink
            mediaPlayer={mediaPlayer}
            musicDisplay={musicDisplay}
            notationSettings={notationSettings}
            setNotationSettings={setNotationSettings}
          />

          <SplitPaneLayout
            handle={renderVideo}
            pane1Content={
              <Media video={renderVideo} src={notation.videoUrl} fluid={mediaFluid} onPlayerChange={setMediaPlayer} />
            }
            pane1Supplements={sidecar}
            pane1DefaultHeight={notationSettings.defaultTheaterHeightPx}
            pane1DefaultWidth={notationSettings.defaultSidecarWidthPx}
            pane1MinHeight={renderVideo ? MIN_THEATER_HEIGHT_PX : 0}
            pane1MaxHeight={renderVideo ? pane1MaxHeight : 0}
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
                    videoControls={renderVideoControls}
                    notation={notation}
                    musicDisplay={musicDisplay}
                    mediaPlayer={mediaPlayer}
                    settings={notationSettings}
                    setSettings={setNotationSettings}
                    settingsContainer={settingsContainerRef.current || false}
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
};
