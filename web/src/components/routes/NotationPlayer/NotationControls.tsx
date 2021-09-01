import { FileImageOutlined, PauseOutlined, RightOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Drawer, Row, Slider, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { isNumber } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { VideoJsPlayer } from 'video.js';
import { CursorInfo, MusicDisplay } from '../../../lib/MusicDisplay';
import { SliderTooltip } from './SliderTooltip';
import { NotationPlayerSettings } from './types';

const Outer = styled.div`
  bottom: 0;
  z-index: 3;
  background: white;
  border-top: 1px solid ${(props) => props.theme['@border-color']};
  padding: 16px 16px;
  position: absolute;
  width: 100%;
`;

const DetailImg = styled.img`
  width: 36px;
  height: 36px;
`;

const MissingImgIcon = styled(FileImageOutlined)`
  font-size: 2em;
  color: ${(props) => props.theme['@muted']};
`;

const SliderOuter = styled.div`
  width: 100%;
  padding: 0 16px 0 16px;
`;

const StyledButton = styled(Button)`
  color: ${(props) => props.theme['@muted']};
  border: none;
`;

const SettingsInner = styled.div`
  overflow-y: auto;
  /* offset the control bar so the */
  height: calc(100vh - 190px);
`;

enum VideoPlayerState {
  Paused,
  Playing,
}

export type Props = {
  durationMs: number;
  songName: string;
  artistName: string;
  thumbnailUrl: string;
  videoPlayer: VideoJsPlayer;
  musicDisplay: MusicDisplay | null;
  settings: NotationPlayerSettings;
  onSettingsChange: (notationPlayerSettings: NotationPlayerSettings) => void;
  onSeek: (currentTimeMs: number) => void;
  onSeekEnd: () => void;
};

const timestamp = (ms: number): string => {
  const mins = Math.floor(ms / 60000);

  const leftoverMs = ms % 60000;
  const secs = Math.floor(leftoverMs / 1000);

  const minsStr = mins.toString().padStart(2, '0');
  const secsStr = secs.toString().padStart(2, '0');

  return `${minsStr}:${secsStr}`;
};

export const NotationControls: React.FC<Props> = (props) => {
  const { videoPlayer, settings, musicDisplay, onSettingsChange } = props;

  const [videoPlayerState, setVideoPlayerState] = useState(VideoPlayerState.Paused);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [cursorInfo, setCursorInfo] = useState<CursorInfo>({
    currentMeasureIndex: 0,
    currentMeasureNumber: 1,
    numMeasures: 0,
  });

  const value = props.durationMs === 0 ? 0 : (currentTimeMs / props.durationMs) * 100;

  const onPlayPauseClick = useCallback(() => {
    switch (videoPlayerState) {
      case VideoPlayerState.Paused:
        videoPlayer.play();
        break;
      case VideoPlayerState.Playing:
        videoPlayer.pause();
        break;
      default:
        console.warn(`unknown player state '${videoPlayerState}', ignoring'`);
    }
  }, [videoPlayer, videoPlayerState]);

  const onSettingsClick = useCallback(() => {
    setIsSettingsVisible((isSettingsVisible) => !isSettingsVisible);
  }, []);

  const onSettingsClose = useCallback(() => {
    setIsSettingsVisible(false);
  }, []);

  const onFretboardVisibilityChange = useCallback(
    (event: CheckboxChangeEvent) => {
      onSettingsChange({ ...settings, isFretboardVisible: event.target.checked });
    },
    [settings, onSettingsChange]
  );

  useEffect(() => {
    const onPlay = () => {
      setVideoPlayerState(VideoPlayerState.Playing);
    };
    videoPlayer.on('play', onPlay);

    const onPause = () => {
      setVideoPlayerState(VideoPlayerState.Paused);
    };
    videoPlayer.on('pause', onPause);

    // We don't want to store the currentTimeMs state on the parent NotationPlayer component,
    // since it houses a lot of other components and could potentially trigger a lot of other
    // unwanted updates. We only want components that need the currentTimeMs to update.
    let rafHandle = 0;
    const updateCurrentTimeMs = () => {
      setCurrentTimeMs(videoPlayer.currentTime() * 1000);
      rafHandle = window.requestAnimationFrame(updateCurrentTimeMs);
    };
    updateCurrentTimeMs();

    return () => {
      cancelAnimationFrame(rafHandle);

      videoPlayer.off('pause', onPause);

      videoPlayer.off('play', onPlay);
    };
  }, [videoPlayer]);

  const Detail = useMemo(
    () => () => {
      return props.thumbnailUrl ? (
        <Tooltip title={`${props.songName} by ${props.artistName}`}>
          <DetailImg src={props.thumbnailUrl} alt="notation detail image" />
        </Tooltip>
      ) : (
        <Tooltip title={`${props.songName} by ${props.artistName}`}>
          <MissingImgIcon />
        </Tooltip>
      );
    },
    [props.songName, props.artistName, props.thumbnailUrl]
  );

  const { durationMs, onSeek } = props;
  const onChange = useCallback(
    (value: number) => {
      const currentTimeMs = (value / 100) * durationMs;
      onSeek(currentTimeMs);
    },
    [durationMs, onSeek]
  );

  const tipFormatter = useCallback(
    (value?: number | undefined) => {
      let currentTimestamp: string;
      let durationTimestamp: string;
      if (isNumber(value)) {
        const currentTimeMs = (value / 100) * durationMs;
        currentTimestamp = timestamp(currentTimeMs);
        durationTimestamp = timestamp(durationMs);
      } else {
        currentTimestamp = '?';
        durationTimestamp = '?';
      }

      const currentMeasureNumber = cursorInfo.currentMeasureNumber.toString();

      return (
        <SliderTooltip
          currentMeasureNumber={currentMeasureNumber}
          currentTimestamp={currentTimestamp}
          durationTimestamp={durationTimestamp}
        />
      );
    },
    [cursorInfo, durationMs]
  );

  const handleStyle = useMemo(() => ({ width: 21, height: 21, marginTop: -8 }), []);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }

    const cursorInfoChangedHandle = musicDisplay.eventBus.subscribe('cursorinfochanged', setCursorInfo);

    return () => {
      musicDisplay.eventBus.unsubscribe(cursorInfoChangedHandle);
    };
  }, [musicDisplay]);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }

    const voicePointerClickedHandle = musicDisplay.eventBus.subscribe('voicepointerclicked', (payload) => {
      onSeek(payload.timeMs);
    });

    return () => {
      musicDisplay.eventBus.unsubscribe(voicePointerClickedHandle);
    };
  }, [musicDisplay, onSeek]);

  const isPaused = videoPlayerState === VideoPlayerState.Paused;

  return (
    <Outer>
      <Row justify="center" align="middle">
        <Col xs={2} sm={2} md={2} lg={1} xl={1} xxl={1}>
          <Row justify="center" align="middle">
            <StyledButton
              size="large"
              shape="circle"
              icon={isPaused ? <RightOutlined /> : <PauseOutlined />}
              onClick={onPlayPauseClick}
            />
          </Row>
        </Col>
        <Col xs={20} sm={20} md={20} lg={20} xl={20} xxl={20}>
          <Row justify="center" align="middle">
            <SliderOuter>
              <Slider
                step={0.01}
                handleStyle={handleStyle}
                value={value}
                tipFormatter={tipFormatter}
                onChange={onChange}
                onAfterChange={props.onSeekEnd}
              />
            </SliderOuter>
          </Row>
        </Col>
        <Col xs={2} sm={2} md={2} lg={1} xl={1} xxl={1}>
          <Row justify="center" align="middle">
            <StyledButton size="large" shape="circle" icon={<SettingOutlined />} onClick={onSettingsClick} />
          </Row>
        </Col>
        <Col xs={0} sm={0} md={0} lg={0} xl={2} xxl={2}>
          <Row justify="center" align="middle">
            <Detail />
          </Row>
        </Col>
      </Row>
      <Drawer
        title="settings"
        placement="right"
        keyboard
        closable={false}
        visible={isSettingsVisible}
        onClose={onSettingsClose}
        zIndex={2}
      >
        <SettingsInner>
          <Checkbox checked={props.settings.isFretboardVisible} onChange={onFretboardVisibilityChange}>
            fretboard
          </Checkbox>
        </SettingsInner>
      </Drawer>
    </Outer>
  );
};
