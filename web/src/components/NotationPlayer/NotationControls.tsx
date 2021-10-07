import { PauseOutlined, RightOutlined, SettingOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Col, Drawer, Row, Slider } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { VideoJsPlayer } from 'video.js';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { ScrollBehaviorType } from '../../lib/MusicDisplay/scroller';
import { NotationDetail } from './NotationDetail';
import { useMusicDisplayClickEffect } from './useMusicDisplayClickEffect';
import { useMusicDisplayCursorInteractionEffects } from './useMusicDisplayCursorInteractionEffects';
import { useMusicDisplayCursorSnapshot } from './useMusicDisplayCursorSnapshot';
import { useMusicDisplayScrollBehaviorEffect } from './useMusicDisplayScrollBehaviorEffect';
import { useMusicDisplayScrollBehaviorType } from './useMusicDisplayScrollBehaviorType';
import { useMusicDisplayScrollControls } from './useMusicDisplayScrollControls';
import { useMusicDisplaySelectionInteractionEffects } from './useMusicDisplaySelectionInteractionEffects';
import { NotationPlayerSettings, NotationPlayerSettingsApi } from './useNotationPlayerSettings';
import { useSelectionLoopingEffect } from './useSelectionLoopingEffect';
import { useTipFormatter } from './useTipFormatter';
import { useVideoPlayerControls, VideoPlayerState } from './useVideoPlayerControls';
import { useVideoPlayerCurrentTimeMs } from './useVideoPlayerCurrentTimeMs';
import { useVideoPlayerState } from './useVideoPlayerState';

const Outer = styled.div`
  z-index: 3;
  background: white;
  border-top: 1px solid ${(props) => props.theme['@border-color']};
  padding: 16px 16px;
  width: 100%;
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

const FloatingAlert = styled(Alert)`
  position: fixed;
  z-index: 5;
  bottom: 80px;
  right: 24px;
`;

export type Props = {
  durationMs: number;
  songName: string;
  artistName: string;
  thumbnailUrl: string;
  videoPlayer: VideoJsPlayer;
  musicDisplay: MusicDisplay | null;
  settings: NotationPlayerSettings;
  settingsApi: NotationPlayerSettingsApi;
};

export const NotationControls: React.FC<Props> = ({
  videoPlayer,
  musicDisplay,
  durationMs,
  thumbnailUrl,
  songName,
  artistName,
  settings,
  settingsApi,
}) => {
  // state

  const controlsDivRef = useRef<HTMLDivElement>(null);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const videoPlayerControls = useVideoPlayerControls(videoPlayer);
  const currentTimeMs = useVideoPlayerCurrentTimeMs(videoPlayer);
  const videoPlayerState = useVideoPlayerState(videoPlayer);
  const isPaused = videoPlayerState === VideoPlayerState.Paused;
  const isPlaying = videoPlayerState === VideoPlayerState.Playing;
  const scrollBehaviorType = useMusicDisplayScrollBehaviorType(musicDisplay);
  const isNoopScrolling = scrollBehaviorType === ScrollBehaviorType.Noop;
  const cursorSnapshot = useMusicDisplayCursorSnapshot(musicDisplay);
  const tipFormatter = useTipFormatter(cursorSnapshot, durationMs);
  const value = durationMs === 0 ? 0 : (currentTimeMs / durationMs) * 100;
  const handleStyle = useMemo(() => ({ width: 21, height: 21, marginTop: -8 }), []);
  const musicDisplayScrollControls = useMusicDisplayScrollControls(musicDisplay, settings.isAutoscrollPreferred);

  // callbacks

  const onSettingsClick = useCallback(() => {
    setIsSettingsVisible((isSettingsVisible) => !isSettingsVisible);
  }, []);
  const onSettingsClose = useCallback(() => {
    setIsSettingsVisible(false);
  }, []);
  const onFretboardVisibilityChange = useCallback(
    (event: CheckboxChangeEvent) => {
      settingsApi.setFretboardVisibility(event.target.checked);
    },
    [settingsApi]
  );
  const onAutoscrollPreferenceChange = useCallback(
    (event: CheckboxChangeEvent) => {
      settingsApi.setAutoscrollPreference(event.target.checked);
    },
    [settingsApi]
  );
  const onChange = useCallback(
    (value: number) => {
      videoPlayerControls.suspend();
      const timeMs = (value / 100) * durationMs;
      if (musicDisplay && !musicDisplay.getLoop().timeMsRange.contains(timeMs)) {
        musicDisplay.getLoop().deactivate();
      }
      videoPlayerControls.seek(timeMs);
    },
    [durationMs, musicDisplay, videoPlayerControls]
  );
  const onAfterChange = useCallback(() => {
    videoPlayerControls.unsuspend();
    musicDisplayScrollControls.startPreferentialScrolling();
  }, [videoPlayerControls, musicDisplayScrollControls]);
  const onAutoscrollDisabledClose = useCallback(() => {
    if (!musicDisplay) {
      return;
    }
    musicDisplay.getScroller().startAutoScrolling();
    musicDisplay.getCursor().scrollIntoView();
  }, [musicDisplay]);

  // effects

  useSelectionLoopingEffect(musicDisplay, currentTimeMs, isPlaying, videoPlayerControls);
  useMusicDisplayScrollBehaviorEffect(musicDisplay);
  useMusicDisplayCursorInteractionEffects(musicDisplay, videoPlayerControls, musicDisplayScrollControls);
  useMusicDisplaySelectionInteractionEffects(musicDisplay, videoPlayerControls, musicDisplayScrollControls);
  useMusicDisplayClickEffect(musicDisplay, videoPlayerControls, musicDisplayScrollControls);
  useEffect(() => {
    musicDisplay?.getCursor().update(currentTimeMs);
  }, [musicDisplay, currentTimeMs]);
  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    musicDisplayScrollControls.startPreferentialScrolling();
  }, [musicDisplay, settings.isAutoscrollPreferred, musicDisplayScrollControls]);
  useEffect(() => {
    if (musicDisplay && isPlaying) {
      musicDisplayScrollControls.startPreferentialScrolling();
    }
  }, [isPlaying, musicDisplay, musicDisplayScrollControls]);

  return (
    <Outer ref={controlsDivRef}>
      {isNoopScrolling && settings.isAutoscrollPreferred && isPlaying && (
        <FloatingAlert
          showIcon
          closable
          closeText="enable"
          onClose={onAutoscrollDisabledClose}
          type="warning"
          message="autoscroll temporarily disabled"
        />
      )}
      <Row justify="center" align="middle">
        <Col xs={2} sm={2} md={2} lg={1} xl={1} xxl={1}>
          <Row justify="center" align="middle">
            {isPaused ? (
              <StyledButton size="large" shape="circle" icon={<RightOutlined />} onClick={videoPlayerControls.play} />
            ) : (
              <StyledButton size="large" shape="circle" icon={<PauseOutlined />} onClick={videoPlayerControls.pause} />
            )}
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
                onAfterChange={onAfterChange}
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
            <NotationDetail thumbnailUrl={thumbnailUrl} artistName={artistName} songName={songName} />
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
          <Checkbox checked={settings.isFretboardVisible} onChange={onFretboardVisibilityChange}>
            fretboard
          </Checkbox>
          <Checkbox checked={settings.isAutoscrollPreferred} onChange={onAutoscrollPreferenceChange}>
            autoscroll
          </Checkbox>
        </SettingsInner>
      </Drawer>
    </Outer>
  );
};
