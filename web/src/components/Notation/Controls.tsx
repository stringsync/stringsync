import { InfoCircleOutlined, PauseOutlined, RightOutlined, SettingOutlined } from '@ant-design/icons';
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
import { identity, noop } from 'lodash';
import React, { RefObject, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDevice } from '../../ctx/device';
import { MediaPlayer, PlayState } from '../../lib/MediaPlayer';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { Nullable } from '../../util/types';
import { Detail } from './Detail';
import { useScales } from './hooks/useScales';
import { FretMarkerDisplay, NotationSettings, RenderableNotation } from './types';

export const CONTROLS_HEIGHT_PX = 75;

const DUMMY_DIV = document.createElement('div');

const Outer = styled.div`
  border: 1px solid ${(props) => props.theme['@border-color']};
  height: ${CONTROLS_HEIGHT_PX}px;
  padding: 0 16px;
  z-index: 5;
  background-color: white;
  box-sizing: border-box;
  overflow: hidden;
`;

const SliderOuter = styled.div`
  padding: 0 16px 0 16px;
  width: 100%;

  .ant-slider-with-marks {
    margin: inherit;
  }
`;

const FullHeightRow = styled(Row)`
  height: 100%;
`;

const StyledButton = styled(Button)`
  color: ${(props) => props.theme['@muted']};
  border: none;
  box-shadow: none;
`;

const RotationButton = styled(StyledButton)<{ $rotateDeg: number }>`
  .anticon svg {
    transition: transform 0.3s;
    transform: rotate(${(props) => props.$rotateDeg}deg);
    transform-origin: center;
  }
`;

const SettingsInner = styled.div`
  overflow-y: auto;
  height: calc(100% - ${CONTROLS_HEIGHT_PX}px);

  ::-webkit-scrollbar {
    display: none;
  }
`;

const FloatingAlert = styled(Alert)`
  position: fixed;
  z-index: 5;
  bottom: 80px;
  right: 24px;
`;

type Props = {
  showDetail: boolean;
  videoControls: boolean;
  notation: Nullable<RenderableNotation>;
  settingsContainerRef: RefObject<HTMLDivElement>;
  musicDisplay: MusicDisplay;
  mediaPlayer: MediaPlayer;
  settings: NotationSettings;
  setSettings(settings: NotationSettings): void;
};

export const Controls: React.FC<Props> = (props) => {
  // props
  const showDetail = props.showDetail;
  const settings = props.settings;
  const notation = props.notation;
  const musicDisplay = props.musicDisplay;
  const mediaPlayer = props.mediaPlayer;
  const settingsContainer = props.settingsContainerRef.current;
  const setSettings = props.setSettings;
  const videoControls = props.videoControls;

  // state
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  // device
  const device = useDevice();

  // callbacks
  const onSettingsClick = () => {
    setIsSettingsVisible((currentIsSettingsVisible) => !currentIsSettingsVisible);
  };
  const onSettingsClose = () => {
    setIsSettingsVisible(false);
  };
  const getDrawerContainer = () => settingsContainer || DUMMY_DIV;

  // scales
  const scales = useScales(musicDisplay);

  // settings
  const onVideoVisibilityChange = (event: CheckboxChangeEvent) => {
    setSettings({ ...settings, isVideoVisible: event.target.checked });
  };
  const onFretboardVisibilityChange = (event: CheckboxChangeEvent) => {
    setSettings({ ...settings, isFretboardVisible: event.target.checked });
  };
  const onFretMarkerDisplayChange = (event: RadioChangeEvent) => {
    setSettings({ ...settings, fretMarkerDisplay: event.target.value });
  };
  const onSelectedScaleChange = (value: string) => {
    setSettings({ ...settings, selectedScale: value });
  };
  const onAutoscrollPreferenceChange = (event: CheckboxChangeEvent) => {
    setSettings({ ...settings, isAutoscrollPreferred: event.target.checked });
  };
  const onIsLoopActiveChange = (event: CheckboxChangeEvent) => {
    setSettings({ ...settings, isLoopActive: event.target.checked });
  };

  // video player state
  const [playState, setPlayState] = useState(() => mediaPlayer.getPlayState());
  const isPaused = playState === PlayState.Paused;
  useEffect(() => {
    const eventBusIds = [
      mediaPlayer.eventBus.subscribe('init', () => {
        setPlayState(mediaPlayer.getPlayState());
      }),
      mediaPlayer.eventBus.subscribe('pause', () => {
        setPlayState(PlayState.Paused);
      }),
      mediaPlayer.eventBus.subscribe('play', () => {
        setPlayState(PlayState.Playing);
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...eventBusIds);
    };
  }, [mediaPlayer]);

  // tmp
  const marks = undefined;
  const handleStyle = {};
  const value = 0;
  const tipFormatter = identity;
  const onChange = noop;
  const onAfterChange = noop;

  return (
    <Outer data-testid="controls">
      <FullHeightRow justify="center" align="middle">
        <Col span={showDetail ? 1 : 2}>
          <FullHeightRow justify="center" align="middle">
            {isPaused ? (
              <StyledButton size="large" shape="circle" icon={<RightOutlined />} onClick={mediaPlayer.play} />
            ) : (
              <StyledButton size="large" shape="circle" icon={<PauseOutlined />} onClick={mediaPlayer.pause} />
            )}
          </FullHeightRow>
        </Col>

        <Col span={20}>
          <FullHeightRow justify="center" align="middle">
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
          </FullHeightRow>
        </Col>

        <Col span={showDetail ? 1 : 2}>
          <FullHeightRow justify="center" align="middle">
            <RotationButton
              size="large"
              shape="circle"
              icon={<SettingOutlined />}
              onClick={onSettingsClick}
              $rotateDeg={isSettingsVisible ? 90 : 0}
            />
          </FullHeightRow>
        </Col>

        <Col span={showDetail ? 2 : 0}>
          <FullHeightRow justify="center" align="middle">
            <Detail
              thumbnailUrl={notation?.thumbnailUrl || ''}
              artistName={notation?.artistName || '???'}
              songName={notation?.songName || '???'}
            />
          </FullHeightRow>
        </Col>
      </FullHeightRow>

      <Drawer
        title="settings"
        placement="right"
        keyboard
        closable={false}
        visible={isSettingsVisible}
        onClose={onSettingsClose}
        getContainer={getDrawerContainer}
        zIndex={4}
      >
        <SettingsInner>
          {videoControls && (
            <>
              <Checkbox checked={settings.isVideoVisible} onChange={onVideoVisibilityChange}>
                video
              </Checkbox>

              <Divider />
            </>
          )}

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
              loop <InfoCircleOutlined />
            </Checkbox>
          </Tooltip>
        </SettingsInner>
      </Drawer>
    </Outer>
  );
};
