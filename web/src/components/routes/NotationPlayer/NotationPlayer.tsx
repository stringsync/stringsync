import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Col, Row } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import { $queries, NotationObject } from '../../../graphql';
import { Layout, withLayout } from '../../../hocs';
import { HEADER_HEIGHT_PX } from '../../../hocs/withLayout/DefaultLayout';
import { MusicDisplay } from '../../../lib/MusicDisplay';
import { RootState } from '../../../store';
import { compose } from '../../../util/compose';
import { Notation } from '../../Notation';
import { Video } from '../../Video';
import { NotationControls } from './NotationControls';
import { SuggestedNotations } from './SuggestedNotations';
import { useNotationPlayerSettings } from './useNotationSettings';

const LoadingIcon = styled(LoadingOutlined)`
  font-size: 5em;
  color: ${(props) => props.theme['@border-color']};
`;

const RightBorder = styled.div<{ border: boolean }>`
  box-sizing: border-box;
  border-right: ${(props) => (props.border ? '1px' : '0')} solid ${(props) => props.theme['@border-color']};
`;

const LeftOrTopScrollContainer = styled.div<{ $overflow: boolean }>`
  max-height: calc(100vh - ${HEADER_HEIGHT_PX}px);
  overflow: auto;
`;

const LeftOrTopCol = styled(Col)`
  overflow: hidden;
`;

const RightOrBottomScrollContainer = styled.div<{ $heightOffsetPx: number }>`
  padding-top: 24px;
  background: white;
  height: calc(100vh - ${(props) => props.$heightOffsetPx}px);
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
`;

const RightOrBottomCol = styled(Col)`
  overflow: hidden;
`;

const SongName = styled.h1`
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

interface Props {}

const NotationPlayer: React.FC<Props> = enhance(() => {
  const gtMd = useSelector<RootState, boolean>((state) => {
    const { lg, xl, xxl } = state.viewport;
    return lg || xl || xxl;
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const params = useParams<{ id: string }>();
  const [notation, setNotation] = useState<NotationObject | null>(null);
  const [errors, setErrors] = useState(new Array<string>());
  const [isLoading, setIsLoading] = useState(true);
  const [videoHeightPx, setVideoHeightPx] = useState(0);
  const [musicDisplay, setMusicDisplay] = useState<MusicDisplay | null>(null);
  const [videoPlayer, setVideoPlayer] = useState<VideoJsPlayer | null>(null);
  const [settings, updateSettings] = useNotationPlayerSettings();
  const [controlsHeightPx, setControlsHeightPx] = useState(0);

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

  const onVideoResize = useCallback((widthPx: number, heightPx: number) => {
    setVideoHeightPx(heightPx);
  }, []);

  const onTimeUpdate = useCallback(
    (timeMs: number) => {
      if (!musicDisplay) {
        return;
      }
      musicDisplay.cursor.update(timeMs);
    },
    [musicDisplay]
  );

  const onUserScroll = useCallback(() => {
    console.log('user scrolled!');
  }, []);

  const onMusicDisplayChange = useCallback(setMusicDisplay, [setMusicDisplay]);

  const onVideoPlayerChange = useCallback(setVideoPlayer, [setVideoPlayer]);

  const onSettingsChange = useCallback(updateSettings, [updateSettings]);

  const onControlsDivMount = useCallback((div: HTMLDivElement) => {
    setControlsHeightPx(div.offsetHeight);
  }, []);

  // Prevent the outer container from scrolling. The reason why we need this is
  // needed is because when the viewport is ltEqMd, the body will almost certainly
  // overflow, causing a scroll bar on the outer page (and the inner page from the
  // right/bottom column overflow). This is a reasonable hack that will undo itself
  // when the user navigates away from the page.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    setErrors([]);
    setIsLoading(true);
    setNotation(null);
    (async () => {
      const { data, errors } = await $queries.notation({ id: params.id });
      if (errors) {
        setErrors(errors.map((error) => error.message));
      } else if (!data?.notation) {
        setErrors([`no notation found with id '${params.id}'`]);
      } else {
        setNotation(data.notation);
      }
      setIsLoading(false);
    })();
  }, [params.id]);

  const hasErrors = errors.length > 0;
  const rightOrBottomScrollContainerOffsetHeightPx =
    (gtMd ? HEADER_HEIGHT_PX : HEADER_HEIGHT_PX + videoHeightPx) + controlsHeightPx;

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
              <Video
                onVideoPlayerChange={onVideoPlayerChange}
                onVideoResize={onVideoResize}
                onTimeUpdate={onTimeUpdate}
                playerOptions={playerOptions}
              />
              <RightBorder border={gtMd}>{gtMd && <SuggestedNotations srcNotationId={notation.id} />}</RightBorder>
            </LeftOrTopScrollContainer>
          </LeftOrTopCol>
          <RightOrBottomCol xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
            <RightOrBottomScrollContainer
              $heightOffsetPx={rightOrBottomScrollContainerOffsetHeightPx}
              ref={scrollContainerRef}
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
                  onUserScroll={onUserScroll}
                />
              )}
            </RightOrBottomScrollContainer>

            {videoPlayer && (
              <NotationControls
                songName={notation.songName || ''}
                artistName={notation.artistName || ''}
                durationMs={notation.durationMs}
                thumbnailUrl={notation.thumbnailUrl || ''}
                videoPlayer={videoPlayer}
                musicDisplay={musicDisplay}
                settings={settings}
                onSettingsChange={onSettingsChange}
                onDivMount={onControlsDivMount}
              />
            )}
          </RightOrBottomCol>
        </Row>
      )}
    </div>
  );
});

export default NotationPlayer;
