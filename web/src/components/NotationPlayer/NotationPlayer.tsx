import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Col, Row } from 'antd';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import { useViewport } from '../../ctx/viewport/useViewport';
import { Layout, withLayout } from '../../hocs/withLayout';
import { HEADER_HEIGHT_PX } from '../../hocs/withLayout/DefaultLayout';
import { useNoOverflow } from '../../hooks/useNoOverflow';
import { useNotation } from '../../hooks/useNotation';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { compose } from '../../util/compose';
import { Fretboard, FretboardOptions, PositionFilterParams, PositionStyle } from '../Fretboard';
import { Notation } from '../Notation';
import { Video } from '../Video';
import { NotationControls } from './NotationControls';
import { SuggestedNotations } from './SuggestedNotations';
import { useMeasurePositions } from './useMeasurePositions';
import { useMusicDisplayCursorSnapshot } from './useMusicDisplayCursorSnapshot';
import { useNotationPlayerSettings } from './useNotationSettings';
import { usePressedPositions } from './usePressedPositions';

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

const NotationScrollContainer = styled.div`
  background: white;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  flex: 2;
  align-items: stretch;
`;

const FretboardContainer = styled.div`
  background-color: white;
  border-top: 1px solid ${(props) => props.theme['@border-color']};

  figure {
    margin: 0;
  }
`;

const NotationControlsContainer = styled.div``;

const RightOrBottomCol = styled(Col)`
  background: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${HEADER_HEIGHT_PX}px);
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

const NotationPlayer: React.FC = enhance(() => {
  const { lg, xl, xxl } = useViewport();
  const gtMd = lg || xl || xxl;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay | null>(null);
  const [videoPlayer, setVideoPlayer] = useState<VideoJsPlayer | null>(null);
  const [settings, updateSettings] = useNotationPlayerSettings();

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

  const fretboardOpts = useMemo<FretboardOptions>(
    () => ({
      dotText: (params: PositionFilterParams) => params.note,
      dotFill: 'white',
    }),
    []
  );
  const cursorSnapshot = useMusicDisplayCursorSnapshot(musicDisplay);
  const measurePositions = useMeasurePositions(cursorSnapshot);
  const pressedPositions = usePressedPositions(cursorSnapshot, videoPlayer);
  const pressedStyle = useMemo<Partial<PositionStyle>>(() => ({ fill: '#ff636c' }), []);

  const onMusicDisplayChange = useCallback(setMusicDisplay, [setMusicDisplay]);

  const onVideoPlayerChange = useCallback(setVideoPlayer, [setVideoPlayer]);

  const onSettingsChange = useCallback(updateSettings, [updateSettings]);

  useNoOverflow(document.body);

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

      {gtMd}

      {!isLoading && !hasErrors && notation && (
        <Row>
          <LeftOrTopCol xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
            <LeftOrTopScrollContainer $overflow={gtMd}>
              <Video onVideoPlayerChange={onVideoPlayerChange} playerOptions={playerOptions} />
              <RightBorder border={gtMd}>{gtMd && <SuggestedNotations srcNotationId={notation.id} />}</RightBorder>
            </LeftOrTopScrollContainer>
          </LeftOrTopCol>

          <RightOrBottomCol xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
            <NotationScrollContainer ref={scrollContainerRef}>
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

            {settings.isFretboardVisible && videoPlayer && (
              <FretboardContainer>
                <Fretboard options={fretboardOpts}>
                  {measurePositions.map(({ string, fret }) => (
                    <Fretboard.Position
                      key={`measure-${string}-${fret}`}
                      string={string}
                      fret={fret}
                      style={{ fill: '#ddd' }}
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
                </Fretboard>
              </FretboardContainer>
            )}

            {videoPlayer && (
              <NotationControlsContainer>
                <NotationControls
                  songName={notation.songName || ''}
                  artistName={notation.artistName || ''}
                  durationMs={notation.durationMs}
                  thumbnailUrl={notation.thumbnailUrl || ''}
                  videoPlayer={videoPlayer}
                  musicDisplay={musicDisplay}
                  settings={settings}
                  onSettingsChange={onSettingsChange}
                />
              </NotationControlsContainer>
            )}
          </RightOrBottomCol>
        </Row>
      )}
    </div>
  );
});

export default NotationPlayer;
