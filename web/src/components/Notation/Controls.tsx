import { InfoCircleOutlined, PauseOutlined, RightOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Divider, Drawer, Radio, RadioChangeEvent, Row, Select, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { RefObject, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDevice } from '../../ctx/device';
import { MediaPlayer, PlayState } from '../../lib/MediaPlayer';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { Nullable } from '../../util/types';
import { Detail } from './Detail';
import { useScales } from './hooks/useScales';
import { Seekbar } from './Seekbar';
import { FretMarkerDisplay, NotationSettings, RenderableNotation, ScaleSelectionType } from './types';
import { VolumeSlider } from './VolumeSlider';

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
    switch (value) {
      case 'none':
        setSettings({ ...settings, scaleSelectionType: ScaleSelectionType.None, selectedScale: null });
        break;
      case 'dynamic':
        setSettings({ ...settings, scaleSelectionType: ScaleSelectionType.Dynamic });
        break;
      default:
        setSettings({ ...settings, scaleSelectionType: ScaleSelectionType.User, selectedScale: value });
    }
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
      mediaPlayer.eventBus.subscribe('playstatechange', (payload) => {
        setPlayState(payload.playState);
      }),
    ];
    return () => {
      mediaPlayer.eventBus.unsubscribe(...eventBusIds);
    };
  }, [mediaPlayer]);

  return (
    <Outer data-testid="controls">
      <FullHeightRow justify="center" align="middle">
        <Col span={2}>
          <FullHeightRow justify="center" align="middle">
            {isPaused ? (
              <StyledButton size="large" shape="circle" icon={<RightOutlined />} onClick={mediaPlayer.play} />
            ) : (
              <StyledButton size="large" shape="circle" icon={<PauseOutlined />} onClick={mediaPlayer.pause} />
            )}
          </FullHeightRow>
        </Col>

        <Col span={showDetail ? 18 : 20}>
          <FullHeightRow justify="center" align="middle">
            <Seekbar notation={notation} musicDisplay={musicDisplay} mediaPlayer={mediaPlayer} />
          </FullHeightRow>
        </Col>

        <Col span={2}>
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

          <Divider />

          <h5>volume</h5>
          <VolumeSlider />
        </SettingsInner>
      </Drawer>
    </Outer>
  );
};
