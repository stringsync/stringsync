import { PauseOutlined, QuestionCircleOutlined, RightOutlined, SettingOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Divider,
  Drawer,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Slider,
  Tooltip,
} from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { VideoJsPlayer } from 'video.js';
import { useDevice } from '../../ctx/device';
import { OpenSheetMusicDisplay } from '../../lib/MusicDisplay';
import { ScrollBehaviorType } from '../../lib/MusicDisplay/scroller';
import { NotationDetail } from './NotationDetail';
import { useMusicDisplayClickEffect } from './useMusicDisplayClickEffect';
import { useMusicDisplayCursorInteractionEffects } from './useMusicDisplayCursorInteractionEffects';
import { useMusicDisplayCursorSnapshot } from './useMusicDisplayCursorSnapshot';
import { useMusicDisplayScrollControls } from './useMusicDisplayScrollControls';
import { useMusicDisplayScrolling } from './useMusicDisplayScrolling';
import { useMusicDisplaySelection } from './useMusicDisplaySelection';
import {
  FretMarkerDisplay,
  NotationPlayerSettings,
  NotationPlayerSettingsApi,
  ScaleSelectionType,
} from './useNotationPlayerSettings';
import { useScales } from './useScales';
import { useScrollBehaviorType } from './useScrollBehaviorType';
import { useSelectionLoop } from './useSelectionLoop';
import { useSliderMarks } from './useSliderMarks';
import { useTipFormatter } from './useTipFormatter';
import { useVideoPlayerControls, VideoPlayerState } from './useVideoPlayerControls';
import { useVideoPlayerCurrentTimeMs } from './useVideoPlayerCurrentTimeMs';
import { useVideoPlayerState } from './useVideoPlayerState';

export const NOTATION_CONTROLS_HEIGHT_PX = 75;

const Outer = styled.div`
  background: white;
  padding: 16px 16px;
  height: ${NOTATION_CONTROLS_HEIGHT_PX};
`;

const SliderOuter = styled.div`
  width: 100%;
  padding: 0 16px 0 16px;

  .ant-slider-with-marks {
    margin: inherit;
  }
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
  videoPlayer: VideoJsPlayer | null;
  musicDisplay: OpenSheetMusicDisplay | null;
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
  const scrollBehaviorType = useScrollBehaviorType(musicDisplay);
  const isNoopScrolling = scrollBehaviorType === ScrollBehaviorType.Noop;
  const cursorSnapshot = useMusicDisplayCursorSnapshot(musicDisplay);
  const tipFormatter = useTipFormatter(cursorSnapshot, durationMs);
  const value = durationMs === 0 ? 0 : (currentTimeMs / durationMs) * 100;
  const handleStyle = useMemo(() => ({ width: 21, height: 21, marginTop: -8 }), []);
  const scales = useScales(musicDisplay);
  const marks = useSliderMarks(musicDisplay, durationMs);
  const scrollControls = useMusicDisplayScrollControls(musicDisplay, settings);
  const device = useDevice();

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
  const onVideoVisibilityChange = useCallback(
    (event: CheckboxChangeEvent) => {
      settingsApi.setVideoVisibility(event.target.checked);
    },
    [settingsApi]
  );
  const onAutoscrollPreferenceChange = useCallback(
    (event: CheckboxChangeEvent) => {
      settingsApi.setAutoscrollPreference(event.target.checked);
    },
    [settingsApi]
  );
  const onIsLoopActiveChange = useCallback(
    (event: CheckboxChangeEvent) => {
      settingsApi.setIsLoopActive(event.target.checked);
    },
    [settingsApi]
  );
  const onSelectedScaleChange = useCallback(
    (value: string) => {
      switch (value) {
        case 'none':
          settingsApi.setScaleSelectionType(ScaleSelectionType.None);
          settingsApi.setSelectedScale(null);
          break;
        case 'dynamic':
          settingsApi.setScaleSelectionType(ScaleSelectionType.Dynamic);
          break;
        default:
          settingsApi.setScaleSelectionType(ScaleSelectionType.User);
          settingsApi.setSelectedScale(value);
      }
    },
    [settingsApi]
  );
  const onFretMarkerDisplayChange = useCallback(
    (event: RadioChangeEvent) => {
      settingsApi.setFretMarkerDisplay(event.target.value);
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
    scrollControls.startPreferredScrolling();
  }, [videoPlayerControls, scrollControls]);
  const onAutoscrollDisabledClose = useCallback(() => {
    if (!musicDisplay) {
      return;
    }
    musicDisplay.getScroller().startAutoScrolling();
    musicDisplay.getCursor().scrollIntoView();
  }, [musicDisplay]);

  // effects

  useMusicDisplayScrolling(musicDisplay, scrollControls, videoPlayerState);
  useSelectionLoop(musicDisplay, currentTimeMs, isPlaying, videoPlayerControls);
  useMusicDisplayCursorInteractionEffects(musicDisplay, videoPlayerControls);
  useMusicDisplaySelection(musicDisplay, videoPlayerControls);
  useMusicDisplayClickEffect(musicDisplay, videoPlayerControls);
  useEffect(() => {
    musicDisplay?.getCursor().update(currentTimeMs);
  }, [musicDisplay, currentTimeMs]);
  useEffect(() => {
    if (settings.scaleSelectionType !== ScaleSelectionType.Dynamic) {
      return;
    }
    settingsApi.setSelectedScale(scales.currentMain);
  }, [settings, settingsApi, scales]);

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
                marks={marks}
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
          <Checkbox checked={settings.isVideoVisible} onChange={onVideoVisibilityChange}>
            video
          </Checkbox>

          <Divider />

          <Checkbox checked={settings.isFretboardVisible} onChange={onFretboardVisibilityChange}>
            fretboard
          </Checkbox>

          <br />
          <br />

          <h5>labels</h5>
          <Radio.Group optionType="button" value={settings.fretMarkerDisplay} onChange={onFretMarkerDisplayChange}>
            <Radio.Button value={FretMarkerDisplay.None}>none</Radio.Button>
            <Radio.Button value={FretMarkerDisplay.Degree}>degree</Radio.Button>
            <Radio.Button value={FretMarkerDisplay.Note}>note</Radio.Button>
          </Radio.Group>

          <br />
          <br />

          <h5>scale</h5>
          <Select defaultValue="none" style={{ width: '100%' }} onChange={onSelectedScaleChange}>
            <Select.OptGroup label="default">
              <Select.Option value="none">none</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="recommended">
              <Select.Option value="dynamic">
                <Tooltip title="based on the current key signature">dynamic</Tooltip>
              </Select.Option>
              {scales.main.map((scale) => (
                <Select.Option key={`main-${scale}`} value={scale}>
                  {scale}
                </Select.Option>
              ))}
            </Select.OptGroup>
            {scales.pentatonic.length > 0 && (
              <Select.OptGroup label="pentatonic">
                {scales.pentatonic.map((scale) => (
                  <Select.Option key={`pentatonic-${scale}`} value={scale}>
                    {scale}
                  </Select.Option>
                ))}
              </Select.OptGroup>
            )}
            {scales.major.length > 0 && (
              <Select.OptGroup label="major">
                {scales.major.map((scale) => (
                  <Select.Option key={`major-${scale}`} value={scale}>
                    {scale}
                  </Select.Option>
                ))}
              </Select.OptGroup>
            )}
            {scales.minor.length > 0 && (
              <Select.OptGroup label="minor">
                {scales.minor.map((scale) => (
                  <Select.Option key={`minor-${scale}`} value={scale}>
                    {scale}
                  </Select.Option>
                ))}
              </Select.OptGroup>
            )}
          </Select>

          <Divider />

          <Checkbox checked={settings.isAutoscrollPreferred} onChange={onAutoscrollPreferenceChange}>
            autoscroll
          </Checkbox>

          <br />
          <br />

          <Tooltip
            title={
              device.inputType === 'touchOnly'
                ? 'you can also longpress the notation'
                : 'you can also click and drag on the notation'
            }
          >
            <Checkbox checked={settings.isLoopActive} onChange={onIsLoopActiveChange}>
              loop <QuestionCircleOutlined />
            </Checkbox>
          </Tooltip>
        </SettingsInner>
      </Drawer>
    </Outer>
  );
};
