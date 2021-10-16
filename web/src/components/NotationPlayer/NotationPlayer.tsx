import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Col, Row } from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import { useViewport } from '../../ctx/viewport/useViewport';
import { Layout, withLayout } from '../../hocs/withLayout';
import { HEADER_HEIGHT_PX } from '../../hocs/withLayout/DefaultLayout';
import { useNoOverflow } from '../../hooks/useNoOverflow';
import { useNotation } from '../../hooks/useNotation';
import { useNoTouchAction } from '../../hooks/useNoTouchAction';
import { useNoTouchCallout } from '../../hooks/useNoTouchCallout';
import { useNoUserSelect } from '../../hooks/useNoUserSelect';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { ScrollBehaviorType } from '../../lib/MusicDisplay/scroller';
import { compose } from '../../util/compose';
import { Duration } from '../../util/Duration';
import { Dimensions } from '../../util/types';
import { Fretboard, FretboardOptions, MergeStrategy, PositionFilterParams, PositionStyle } from '../Fretboard';
import { Notation } from '../Notation_DEPRECATED';
import { Player } from '../Player';
import { NotationControls, NOTATION_CONTROLS_HEIGHT_PX } from './NotationControls';
import { SuggestedNotations } from './SuggestedNotations';
import { useMeasurePositions } from './useMeasurePositions';
import { useMusicDisplayCursorSnapshot } from './useMusicDisplayCursorSnapshot';
import { useMusicDisplayLoopSettingSync } from './useMusicDisplayLoopSettingSync';
import { FretMarkerDisplay, ScaleSelectionType, useNotationPlayerSettings } from './useNotationPlayerSettings';
import { usePressedPositions } from './usePressedPositions';
import { useScrollBehaviorType } from './useScrollBehaviorType';
import { useTonic } from './useTonic';

const RESIZE_DEBOUNCE_DURATION = Duration.ms(500);

const LoadingIcon = styled(LoadingOutlined)`
  font-size: 5em;
  color: ${(props) => props.theme['@border-color']};
`;

const RightBorder = styled.div<{ border: boolean }>`
  box-sizing: border-box;
  border-right: ${(props) => (props.border ? '1px' : '0')} solid ${(props) => props.theme['@border-color']};
`;

const LeftOrTopScrollContainer = styled.div<{ $overflow: boolean }>`
  overflow: ${(props) => (props.$overflow ? 'auto' : 'hidden')};
  max-height: calc(100vh - ${HEADER_HEIGHT_PX}px);
`;

const LeftOrTopCol = styled(Col)`
  overflow: hidden;
`;

const NotationScrollContainer = styled.div<{ $height: number; $isScrollingEnabled: boolean }>`
  background: white;
  overflow-x: hidden;
  overflow-y: ${(props) => (props.$isScrollingEnabled ? 'auto' : 'hidden')};
  height: 100%;
  max-height: ${(props) => props.$height}px;
  transition: max-height 500ms;
`;

const FretboardContainer = styled.div`
  background-color: white;
  border-top: 1px solid ${(props) => props.theme['@border-color']};

  figure {
    margin: 0;
  }
`;

const NotationControlsContainer = styled.div`
  border-top: 1px solid ${(props) => props.theme['@border-color']};
`;

const RightOrBottomCol = styled(Col)`
  background: white;
  overflow: hidden;
`;

const SongName = styled.h1`
  margin-top: 24px;
  text-align: center;
  font-size: 2em;
  margin-bottom: 0;
`;

const ArtistName = styled.h2`
  text-align: center;
  font-size: 1.25em;
  margin-bottom: 4px;
`;

const TranscriberName = styled.h3`
  text-align: center;
  font-size: 1em;
  font-weight: normal;
  color: ${(props) => props.theme['@muted']};
`;

const enhance = compose(withLayout(Layout.DEFAULT, { lanes: false, footer: false }));

export const NotationPlayer: React.FC = enhance(() => {
  const { lg, xl, xxl, innerHeight } = useViewport();
  const gtMd = lg || xl || xxl;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay | null>(null);
  const [videoPlayer, setVideoPlayer] = useState<VideoJsPlayer | null>(null);
  const [videoHeightPx, setVideoHeightPx] = useState(0);
  const [fretboardHeightPx, setFretboardHeightPx] = useState(0);
  const [scrollContainerHeightPx, setScrollContainerHeightPx] = useState(() => innerHeight - HEADER_HEIGHT_PX);
  const [settings, settingsApi] = useNotationPlayerSettings();
  const scrollBehaviorType = useScrollBehaviorType(musicDisplay);
  const isTouchScrollingEnabled = scrollBehaviorType !== ScrollBehaviorType.Manual;

  const params = useParams<{ id: string }>();
  const [notation, errors, isLoading] = useNotation(params.id);
  const hasErrors = errors.length > 0;
  const videoUrl = notation?.videoUrl;
  const playerOptions = useMemo<VideoJsPlayerOptions>(() => {
    return videoUrl
      ? {
          sources: [
            {
              src: videoUrl || '',
              type: 'application/x-mpegURL',
            },
          ],
        }
      : {};
  }, [videoUrl]);

  const fretboardOpts = useMemo<FretboardOptions>(() => {
    switch (settings.fretMarkerDisplay) {
      case FretMarkerDisplay.None:
        return { dotFill: 'white' };
      case FretMarkerDisplay.Degree:
        return { dotText: (params: PositionFilterParams) => params.grade, dotFill: 'white' };
      case FretMarkerDisplay.Note:
        return { dotText: (params: PositionFilterParams) => params.note };
      default:
        return { dotFill: 'white' };
    }
  }, [settings.fretMarkerDisplay]);

  const tonic = useTonic(settings.selectedScale, musicDisplay);
  const cursorSnapshot = useMusicDisplayCursorSnapshot(musicDisplay);
  const measurePositions = useMeasurePositions(cursorSnapshot);
  const pressedPositions = usePressedPositions(cursorSnapshot, videoPlayer);
  const pressedStyle = useMemo<Partial<PositionStyle>>(() => ({ fill: '#f5c2c5', stroke: '#f03e47' }), []);

  const onMusicDisplayChange = useCallback(setMusicDisplay, [setMusicDisplay]);

  const onVideoPlayerChange = useCallback(setVideoPlayer, [setVideoPlayer]);

  const debouncedSetVideoHeightPx = useMemo(() => {
    return debounce(setVideoHeightPx, RESIZE_DEBOUNCE_DURATION.ms, { leading: true, trailing: true });
  }, []);
  const onVideoResize = useCallback(
    (dimensions: Dimensions) => {
      debouncedSetVideoHeightPx(dimensions.height);
    },
    [debouncedSetVideoHeightPx]
  );

  const debouncedSetFretboardHeightPx = useMemo(() => {
    return debounce(setFretboardHeightPx, RESIZE_DEBOUNCE_DURATION.ms, { leading: true, trailing: true });
  }, []);
  const onFretboardResize = useCallback(
    ({ width, height }) => {
      debouncedSetFretboardHeightPx(height);
    },
    [debouncedSetFretboardHeightPx]
  );

  const debouncedSetScrollContainerHeightPx = useMemo(() => {
    return debounce(setScrollContainerHeightPx, RESIZE_DEBOUNCE_DURATION.ms, { leading: true, trailing: true });
  }, []);
  useEffect(() => {
    const header = HEADER_HEIGHT_PX;
    const controls = NOTATION_CONTROLS_HEIGHT_PX;
    const fretboard = settings.isFretboardVisible ? fretboardHeightPx : 0;
    const video = gtMd ? 0 : videoHeightPx;
    const nextScrollContainerHeightPx = innerHeight - header - controls - fretboard - video;
    debouncedSetScrollContainerHeightPx(nextScrollContainerHeightPx);
  }, [
    gtMd,
    innerHeight,
    fretboardHeightPx,
    videoHeightPx,
    settings.isFretboardVisible,
    debouncedSetScrollContainerHeightPx,
  ]);

  useNoOverflow(document.body);
  useNoUserSelect(document.body);
  useNoTouchAction(document.body);
  useNoTouchCallout(document.body);

  useMusicDisplayLoopSettingSync(musicDisplay, settings, settingsApi);

  return (
    <div data-testid="notation-player">
      {isLoading && (
        <>
          <br />
          <br />
          <Row justify="center">
            <LoadingIcon />
          </Row>
        </>
      )}

      {!isLoading && hasErrors && (
        <>
          <br />
          <br />
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
                  <Link to="/library">library</Link>
                </>
              }
            />
          </Row>
        </>
      )}

      {!isLoading && !hasErrors && notation && (
        <Row>
          <LeftOrTopCol xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
            <LeftOrTopScrollContainer $overflow={gtMd}>
              <Player.Video onPlayerChange={onVideoPlayerChange} playerOptions={playerOptions} />
              <RightBorder border={gtMd}>{gtMd && <SuggestedNotations srcNotationId={notation.id} />}</RightBorder>
            </LeftOrTopScrollContainer>
          </LeftOrTopCol>

          <RightOrBottomCol xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
            {notation && (
              <NotationScrollContainer
                ref={scrollContainerRef}
                $height={scrollContainerHeightPx}
                $isScrollingEnabled={isTouchScrollingEnabled}
              >
                <SongName>{notation.songName}</SongName>
                <ArtistName>by {notation.artistName}</ArtistName>
                <TranscriberName>{notation.transcriber.username}</TranscriberName>

                {notation.musicXmlUrl && (
                  <Notation
                    musicXmlUrl={notation.musicXmlUrl}
                    deadTimeMs={notation.deadTimeMs}
                    durationMs={notation.durationMs}
                    scrollContainerRef={scrollContainerRef}
                    onMusicDisplayChange={onMusicDisplayChange}
                  />
                )}
              </NotationScrollContainer>
            )}

            {settings.isFretboardVisible && (
              <FretboardContainer>
                <Fretboard
                  tonic={tonic || undefined}
                  options={fretboardOpts}
                  styleMergeStrategy={MergeStrategy.Merge}
                  onResize={onFretboardResize}
                >
                  {measurePositions.map(({ string, fret }) => (
                    <Fretboard.Position
                      key={`measure-${string}-${fret}`}
                      string={string}
                      fret={fret}
                      style={{ fill: '#f9f9f9', stroke: '#a0a0a0' }}
                    />
                  ))}
                  {pressedPositions.map(({ string, fret }) => (
                    <Fretboard.Position
                      key={`pressed-${string}-${fret}`}
                      string={string}
                      fret={fret}
                      style={pressedStyle}
                    />
                  ))}
                  {settings.scaleSelectionType !== ScaleSelectionType.None && settings.selectedScale && (
                    <Fretboard.Scale name={settings.selectedScale} style={{ stroke: '#85f4fc' }} />
                  )}
                </Fretboard>
              </FretboardContainer>
            )}

            {notation && (
              <NotationControlsContainer>
                <NotationControls
                  songName={notation.songName || ''}
                  artistName={notation.artistName || ''}
                  durationMs={notation.durationMs}
                  thumbnailUrl={notation.thumbnailUrl || ''}
                  videoPlayer={videoPlayer}
                  musicDisplay={musicDisplay}
                  settings={settings}
                  settingsApi={settingsApi}
                />
              </NotationControlsContainer>
            )}
          </RightOrBottomCol>
        </Row>
      )}
    </div>
  );
});
